import prisma from "@/lib/db";
import { Borrow_detail } from "@prisma/client";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { name, lastname, tel, project, borrowDetails } = await req.json();
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
                Borrow_detail: {
                    create: borrowDetails.map((detail: { setId?: number; itemId?: number }) => ({
                        setId: detail.setId,
                        itemId: detail.itemId,
                    })),
                },
            },
            include: {
                Borrow_detail: true, // Include Borrow_detail สำหรับการอัปเดต item
            },
        });

        if (result) {
            console.log("Borrow created successfully:", result);

            // อัปเดต status ของ item ที่ถูกยืม
            const itemUpdates = borrowDetails.map((detail: Borrow_detail) =>
                prisma.items.update({
                    where: { id: detail.itemId! },
                    data: { status: 'ถูกยืม' },  // กำหนด status ที่ต้องการ
                })
            );

            // รอให้การอัปเดต status ของ items เสร็จ
            await Promise.all(itemUpdates);

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
                            item: {include: {division: true, postfix: true, qr: true}},
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