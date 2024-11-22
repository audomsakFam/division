// import prisma from "@/lib/db";

// const sendNotification = async (
//   writer: any,
//   message: string,
//   borrowId: number,
//   status: number
// ) => {
// //   const encoder = new TextEncoder();
//   await writer.write(`data: ${JSON.stringify({ message, borrowId, status })}\n\n`);
// };

// export async function GET() {
//     const responseStream = new TransformStream();
//     const writer = responseStream.writable.getWriter();
//     const encoder = new TextEncoder();
//     writer.write(encoder.encode(`Connecting Client....\n\n`));

//     const borrowListener = async () => {
//       try {
//         const pendingBorrows = await prisma.borrow.findMany({
//           where: {
//             status: 2,
//           },
//           orderBy: { createAt: 'desc' },
//         });

//         if (pendingBorrows.length > 0) {
//           const updates = pendingBorrows.map(async (borrow) => {
//             if (borrow.status === 2 && borrow.serveAt && Date.now() >= borrow.serveAt.getTime()) {
//               await prisma.borrow.update({
//                 where: { id: borrow.id },
//                 data: { status: 3 },
//               });
//               await sendNotification(
//                 writer,
//                 `Borrow Project name ${borrow.project} status updated to "to return"`,
//                 borrow.id,
//                 borrow.status
//               );
//             }
//           });
//           await Promise.all(updates);
//         }

//         const newBorrow = await prisma.borrow.findFirst({
//           where: { status: 0 },
//           orderBy: { createAt: 'desc' },
//         });

//         if (newBorrow) {
//           await sendNotification(
//             writer,
//             `New borrow created by User ${newBorrow.name}`,
//             newBorrow.id,
//             newBorrow.status
//           );
//         }
//       } catch (error) {
//         console.error('Error in borrowListener:', error);
//         await sendNotification(writer, 'Error processing borrowListener.', 0, 0);
//       }
//     };

//     const intervalId = setInterval(borrowListener, 30000);

//     // เมื่อ client ปิดการเชื่อมต่อ
//     writer.closed.then(async () => {
//         // เมื่อ client ปิดการเชื่อมต่อ ให้ลบ intervalId
//         clearInterval(intervalId);
//         await prisma.$disconnect();
//     }).catch((error) => {
//         // หากเกิดข้อผิดพลาดระหว่างการปิดการเชื่อมต่อ
//         console.error('Error closing writer:', error);
//         clearInterval(intervalId);
//     });
//     try {
//         return new Response(responseStream.readable, {
//             headers: {
//                 'Content-Type': 'text/event-stream',
//                 Connection: 'keep-alive',
//                 'Cache-Control': 'no-cache, no-transform',
//             },
//         });
//     } catch (error) {
//         console.error('Error handling request:', error);
//         await writer.write(encoder.encode('data: error occurred\n\n'));
//         writer.close();
//         clearInterval(intervalId);
//         throw error;
//     }
// }
import express from 'express';
import { PrismaClient } from "@prisma/client";
import cors from 'cors';
const prisma = new PrismaClient();

const app = express();
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

app.get('/api/noti', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');

  // เชื่อมต่อ client
  res.write('Connecting Client....\n\n');

  const borrowListener = async () => {
    try {
      const pendingBorrows = await prisma.borrow.findMany({
        where: {
          status: 2,
        },
        orderBy: { createAt: 'desc' },
      });

      if (pendingBorrows.length > 0) {
        const updates = pendingBorrows.map(async (borrow) => {
          if (borrow.status === 2 && borrow.serveAt && Date.now() >= borrow.serveAt.getTime()) {
            await prisma.borrow.update({
              where: { id: borrow.id },
              data: { status: 3 },
            });
            await sendNotification(
              res,
              `Borrow Project name ${borrow.project} status updated to "to return"`,
              borrow.id,
              borrow.status
            );
          }
        });
        await Promise.all(updates);
      }

      const newBorrow = await prisma.borrow.findFirst({
        where: { status: 0 },
        orderBy: { createAt: 'desc' },
      });

      if (newBorrow) {
        await sendNotification(
          res,
          `New borrow created by User ${newBorrow.name}`,
          newBorrow.id,
          newBorrow.status
        );
      }
    } catch (error) {
      console.error('Error in borrowListener:', error);
      await sendNotification(res, 'Error processing borrowListener.', 0, 0);
    }
  };

  const intervalId = setInterval(borrowListener, 10000);

  // เมื่อ client ปิดการเชื่อมต่อ
  req.on('close', async () => {
    clearInterval(intervalId);
    await prisma.$disconnect();
    console.log('Client disconnected');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
