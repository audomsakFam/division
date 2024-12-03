import prisma from "@/lib/db";
import { Borrow_detail } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { name, lastname, tel, project, borrowDetails, retureAt, serveAt, origanizationId } = await req.json();
        console.log('Received Data: ', { name, lastname, tel, project, borrowDetails });

        // ตรวจสอบว่ามี borrowDetails หรือไม่
        if (!borrowDetails || borrowDetails.length === 0) {
            return NextResponse.json({ error: 'No borrow details provided' }, { status: 400 });
        }

        // สร้าง Borrow พร้อมกับ Borrow_detail
        const result = await prisma.borrow.create({
            data: {
                name,
                lastname,
                tel,
                project,
                retureAt,
                serveAt,
                origanizationId,
                Borrow_detail: {
                    create: borrowDetails.map((detail: { setId?: number; itemId?: number }) => ({
                        setId: detail.setId,
                        itemId: detail.itemId,
                    })),
                },
            },
            include: {
                Borrow_detail: {
                    include: {
                        item: true,
                        set: {
                            include: {
                                Item_set: {
                                    include: {
                                        item: true
                                    }
                                }
                            }
                        }
                    },
                },
                origanization: true
            },
        });

        if (result) {
            // console.log("Borrow created successfully:", result);
            // อัปเดต status ของ item ที่ถูกยืม
            const itemUpdates = borrowDetails.map((detail: Borrow_detail) =>
                prisma.items.update({
                    where: { id: detail.itemId! },
                    data: { status: 'ถูกยืม' },  // กำหนด status ที่ต้องการ
                })
            );

            // รอให้การอัปเดต status ของ items เสร็จ
            await Promise.all(itemUpdates);

            const groupedItems = result.Borrow_detail.reduce((acc: Record<string, number>, detail) => {
                const itemName = detail?.item?.name || 'Unknown'; // กำหนดชื่ออุปกรณ์หรือค่าเริ่มต้น
                acc[itemName] = (acc[itemName] || 0) + 1; // เพิ่มจำนวนของอุปกรณ์
                return acc;
            }, {});
            
            const itemSummary = Object.entries(groupedItems)
                .map(([name, count]) => `${name} ${count} ชิ้น`) // สร้างข้อความสำหรับแต่ละอุปกรณ์
                .join(',\n\t\t\t'); // แปลงเป็นข้อความรวม
            

            const user = await prisma.user.findUnique({
                where: { email: process.env.SMTP_USER },
                select: { email: true, password: true }, // ฟิลด์สำหรับเก็บ SMTP Credentials
            });


            if (!user || !user.email || !user.password) {
                throw new Error("SMTP credentials not found for this user.");
            }

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", // สามารถปรับให้รองรับ SMTP Provider อื่น
                port: 587,
                secure: false, // ใช้ STARTTLS
                auth: {
                    user: user.email,
                    pass: 'ephwtqoczgrkooru',
                },
                logger: true, // เปิด logging
                debug: true,  // เปิด debugging
            });

            const info = await transporter.sendMail({
                from: `"Division Borrow" <${user.email}>`, // Sender email
                to: 'fam841209@gmail.com', // Receiver email
                cc: ["famqqblood@gmail.com"],
                subject: `แจ้งการยืมอุปกรณ์ ${result.project}`,
                text: `
                โครงการ: ${result.project}
                ชื่อ: ${result.name + ' ' + result.lastname}
                เบอร์โทร: ${result.tel}
                จากหน่วยงาน: ${result.origanization?.name}
                อุปกณณ์:\n\t\t\t${itemSummary}
                `,
            });

            console.log("Email sent: ", info.messageId);

            return NextResponse.json(result, {
                status: 200,
            });
        } else {
            return NextResponse.json({ error: 'Failed to create borrow' }, { status: 400 });
        }
    } catch (e) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + e, status: 500 });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const data = await prisma.borrow.findMany(
            {
                include: {
                    origanization: true,
                    Borrow_detail: {
                        include: {
                            item: { include: { division: true, postfix: true, qr: true } },
                            set: {
                                include: {
                                    Item_set: {
                                        include: {
                                            item: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        );
        return NextResponse.json({ data: data, status: 200 });
    } catch (e) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + e, status: 500 });
    }
}