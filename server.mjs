import express from 'express';
import { PrismaClient } from "@prisma/client";
import cors from 'cors';
import path from 'path';
const prisma = new PrismaClient();
const app = express();
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 9000;
app.use(cors({
  origin: '*', // กำหนดต้นทางที่อนุญาต
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // กำหนดวิธีการที่อนุญาต
  allowedHeaders: ['Content-Type', 'Accept'], // กำหนด headers ที่อนุญาต
}));

const sendNotification = async (
  writer,
  message,
  borrowId,
  status
) => {
  writer.write(`data: ${JSON.stringify({ message, borrowId, status })}\n\n`);
};

let lastPongReceived = Date.now();

app.post('/api/ping', (req, res) => {
  console.log('Received pong from client');
  req.on('data', (chunk) => {
    const data = chunk.toString().trim();
    if (data === 'pong') {
      lastPongReceived = Date.now();
    }
  });
  // lastPongReceived = Date.now(); // อัปเดตเวลา
  res.sendStatus(200);
});

app.get('/api/noti', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');

  // เชื่อมต่อ client
  res.write('Connecting Client....\n\n');
  console.log('Client Connected');

  // ส่ง Ping ทุก 30 วินาที
  const pingInterval = setInterval(() => {
    console.log('sending ping...');
    if (Date.now() - lastPongReceived > 35000) {
      console.log('No pong received in 35s, closing connection.');
      res.end();
      clearInterval(pingInterval);
      return;
    }
    res.write(`data: ${JSON.stringify({ type: 'ping' })}\n\n`);
  }, 32000);



  const borrowListener = async () => {
    try {
      // ตรวจสอบ borrow ใหม่
      const [newBorrow, pendingBorrows] = await Promise.all([
        prisma.borrow.findFirst({
          where: { status: 0 },
          orderBy: { createAt: 'desc' },
        }),
        prisma.borrow.findMany({
          where: { status: 2 },
          orderBy: { createAt: 'desc' },
        }),
      ]);

      // ส่ง Notification สำหรับ borrow ใหม่
      if (newBorrow) {
        console.log('send New valid borrow');
        await sendNotification(
          res,
          `New borrow created by User ${newBorrow.name}`,
          newBorrow.id,
          newBorrow.status
        );
      }

      // อัปเดต borrow ที่รอการคืน
      if (pendingBorrows.length > 0) {
        const now = Date.now(); // เก็บค่าเวลาปัจจุบัน
        const updates = pendingBorrows.map((borrow) => {
          if (borrow.status === 2 && now >= (borrow.serveAt.getTime() + 24 * 60 * 60 * 1000)) {
            return prisma.borrow.update({
              where: { id: borrow.id },
              data: { status: 3 },
            }).then(() => {
              console.log('send Update valid borrow');
              return sendNotification(
                res,
                `Borrow Project name ${borrow.project} status updated to "to return"`,
                borrow.id,
                3
              );
            });
          } else {
            return;
          }
        });
        await Promise.all(updates.filter(Boolean)); // กรอง undefined
      }
    } catch (error) {
      console.error('Error in borrowListener:', error);
      await sendNotification(res, 'Error processing borrowListener.', 0, 0);
    }
  };

  const intervalId = setInterval(borrowListener, 6000);

  // เมื่อ client ปิดการเชื่อมต่อ
  req.on('close', async () => {
    clearInterval(intervalId);
    clearInterval(pingInterval);
    await prisma.$disconnect();
    console.log('Client disconnected');
  });
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

