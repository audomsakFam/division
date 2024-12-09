import prisma from "@/lib/db";
import { Borrow_detail, Items } from "@prisma/client";
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

        const result = await prisma.$transaction(async (tx) => {
            // 1. สร้าง Borrow
            const createdBorrow = await tx.borrow.create({
                data: {
                    name,
                    lastname,
                    tel,
                    project,
                    serveAt: new Date(serveAt),
                    retureAt: new Date(retureAt),
                    origanizationId,
                },
                include: {
                    origanization: true
                }
            });

            // 2. สร้าง Borrow_detail
            for (const detail of borrowDetails) {
                // ดึงรายการ `itemId` จาก `Item_set` ใน detail.set
                const itemIds = detail.set?.Item_set?.map((v: any) => v.itemId) || [];

                // สร้าง Borrow_detail สำหรับแต่ละรายการใน borrowDetails
                const data = await tx.borrow_detail.create({
                    data: {
                        borrowId: createdBorrow.id,
                        itemId: detail.itemId,
                        setId: detail.setId,
                    },
                    include: {
                        set: {
                            include: {
                                Item_set: {
                                    where: {
                                        itemId: { in: itemIds }, // ใช้ `in` แทน `flatMap`
                                        setId: detail.setId,
                                    },
                                    include: { item: true },
                                },
                            },
                        },
                    },
                });

                console.log('data======>', data.set?.Item_set)
            }


            const borrowWithDetails = await tx.borrow.findUnique({
                where: { id: createdBorrow.id },
                include: {
                    Borrow_detail: {
                        include: {
                            item: true,
                            set: {
                                include: {
                                    Item_set: {
                                        include: {
                                            item: true, // ดึงข้อมูล item ที่สัมพันธ์กับ Item_set
                                        },
                                    },
                                },
                            },
                        },
                    },
                    origanization: true,
                },
            });
            
            // กรองข้อมูล `Item_set` หลังจากดึงข้อมูล
            borrowWithDetails?.Borrow_detail.forEach(detail => {
                if (detail.set && detail.set.Item_set) {
                    detail.set.Item_set = detail.set.Item_set.filter(itemSet =>
                        borrowDetails.some(
                            (d: any) =>
                                d.setId === detail.setId &&
                                d.set?.Item_set?.some((item: any) => item.itemId === itemSet.itemId)
                        )
                    );
                }
            });

            return borrowWithDetails; // คืนค่าข้อมูล Borrow ที่สร้างขึ้น
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

            const groupedItems = result.Borrow_detail.reduce((acc: Record<string, any>, detail) => {
                const itemName = detail?.item?.name || 'Unknown'; // ชื่ออุปกรณ์หรือค่าเริ่มต้น
                const itemSetName = detail?.set?.name || 'Unknown';
                const itemSetDetails = detail?.set?.Item_set || []; // ดึงรายการ Item_set

                // เพิ่มรายการอุปกรณ์
                acc[itemName] = (acc[itemName] || 0) + 1;

                // เพิ่มรายการ Set และรายละเอียดใน Set
                if (itemSetName !== 'Unknown') {
                    acc[itemSetName] = acc[itemSetName] || {};
                    itemSetDetails.forEach((itemSetDetail: { itemId: number; item?: Items; }) => {
                        const itemInSetName = itemSetDetail.item?.name || `Item ${itemSetDetail.itemId}`;
                        acc[itemSetName][itemInSetName] = (acc[itemSetName][itemInSetName] || 0) + 1;
                    });
                }
                return acc;
            }, {});

            // console.log("Item in Set Name:", groupedItems);

            // แปลงเป็นข้อความสำหรับส่งออกรายการ
            const itemSummary = Object.entries(groupedItems)
                .map(([name, details]) => {
                    if (typeof details === 'number') {
                        // อุปกรณ์เดี่ยว
                        return `${name} จำนวน ${details} ชิ้น`;
                    } else {
                        // อุปกรณ์ใน Set
                        const setDetails = Object.entries(details)
                            .map(([subName, count]) => `  - ${subName}: ${count} ชิ้น`) // ใช้ Bullet point และระยะห่าง
                            .join('\n');
                        return `${name}:\n${setDetails}`; // เพิ่ม ':' หลังชื่อ Set
                    }
                })
                .join('\n\n');

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
                text: `โครงการ: ${result.project}\nชื่อ: ${result.name + ' ' + result.lastname}\nเบอร์โทร: ${result.tel}\nจากหน่วยงาน: ${result.origanization?.name}
                \n\t\t\tอุปกรณ์\n\n${itemSummary}
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