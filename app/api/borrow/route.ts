import prisma from "@/lib/db";
import { Borrow_detail, Items } from "@prisma/client";
import { tr } from "date-fns/locale";
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
                // เพิ่ม Borrow_detail สำหรับ `itemId` เดี่ยว
                if (detail.itemId) {
                    await tx.borrow_detail.create({
                        data: {
                            borrowId: createdBorrow.id,
                            itemId: detail.itemId,
                        },
                    });
                }

                // เพิ่ม Borrow_detail สำหรับ `setId` และรายการ `Item_set`
                if (detail.setId && detail.set?.Item_set) {
                    for (const itemSet of detail.set.Item_set) {
                        const data = await tx.borrow_detail.create({
                            data: {
                                borrowId: createdBorrow.id,
                                setId: detail.setId,
                                itemId: itemSet.itemId, // เพิ่ม itemId จาก Item_set
                            },
                        });
                        console.log('data createset in tx=====>', data)
                    }
                }
            }


            // ดึงข้อมูล Borrow พร้อม Borrow_detail
            const borrowWithDetails = await tx.borrow.findUnique({
                where: { id: createdBorrow.id },
                include: {
                    Borrow_detail: {
                        include: {
                            item: { include: { division: true } },
                            set: true,
                        },
                    },
                    origanization: true,
                },
            });

            return borrowWithDetails;
        });


        if (result) {
            const itemIdsToUpdate = borrowDetails.flatMap((detail: any) => {
                const itemIdsInSet = detail.set?.Item_set?.map((item: any) => item.itemId) || [];
                return [detail.itemId, ...itemIdsInSet].filter((id) => id !== undefined); // กรอง undefined
            });

            if (itemIdsToUpdate.length > 0) {
                await Promise.all(
                    itemIdsToUpdate.map((itemId: any) =>
                        prisma.items.update({
                            where: { id: itemId },
                            data: { status: 'ถูกยืม' },
                        })
                    )
                );
            } else {
                console.error('No valid item IDs to update');
            }

            const groupedItems = result.Borrow_detail.reduce((acc: Record<string, any>, detail) => {
                const itemName = detail?.item?.name && detail?.setId == null ? detail?.item?.name : 'Unknown'; // ชื่ออุปกรณ์หรือค่าเริ่มต้น
                const itemSetName = detail?.set?.name || 'Unknown';
                const divisionName = detail?.item?.division?.name || 'Unknown division';

                // เพิ่ม Division
                if (!acc[divisionName]) {
                    acc[divisionName] = { items: {}, sets: {} };
                }

                // เพิ่มรายการอุปกรณ์เดี่ยวใน Division
                if (itemName !== 'Unknown') {
                    acc[divisionName].items[itemName] = (acc[divisionName].items[itemName] || 0) + 1;
                }

                // เพิ่มรายการ Set และรายละเอียดใน Set
                if (itemSetName !== 'Unknown') {
                    const set = acc[divisionName].sets[itemSetName] || {};
                    // สร้างรายการ itemSetDetails จาก Borrow_detail ของ set นี้
                    const itemSetDetails = result.Borrow_detail
                        .filter((borrow) => borrow.setId === detail.setId)
                        .map((borrow) => ({
                            itemId: borrow.itemId,
                            item: borrow.item,
                        }));

                    const setMap = new Map<string, number>();

                    itemSetDetails.forEach((itemSetDetail) => {
                        const itemInSetName = itemSetDetail.item?.name || `Item ${itemSetDetail.itemId}`;
                        setMap.set(itemInSetName, (setMap.get(itemInSetName) || 0) + 1);
                    });

                    acc[divisionName].sets[itemSetName] = Object.fromEntries(setMap);

                    itemSetDetails.forEach((itemSetDetail) => {
                        const itemInSetName = itemSetDetail.item?.name || `Item ${itemSetDetail.itemId}`;
                        if (!set[itemInSetName]) {
                            set[itemInSetName] = 0; // กำหนดค่าเริ่มต้นเฉพาะเมื่อยังไม่มี
                        }
                        set[itemInSetName] += 1;
                    });
                }

                return acc;
            }, {});

            console.log('groupedItems to mail', groupedItems)
            // delete groupedItems['Unknown'];

            const itemSummary = Object.entries(groupedItems)
                .map(([divisionName, { items, sets }]) => {
                    // กรองอุปกรณ์ที่มีชื่อเป็น 'Unknown'
                    const itemDetails = Object.entries(items)
                        .filter(([itemName, count]) => itemName !== 'Unknown' && itemName !== 'Unknown:') // กรอง 'Unknown' ออก
                        .map(([itemName, count]) => `  - ${itemName}: ${count} ชิ้น`)
                        .join('\n');

                    // กรอง Set ที่มีชื่อเป็น 'Unknown'
                    const setDetails = Object.entries(sets)
                        .filter(([setName, setItems]) => setName !== 'Unknown') // กรอง 'Unknown' ออก
                        .map(([setName, setItems]) => {
                            const setItemDetails = Object.entries(setItems as Record<string, number>)
                                .filter(([itemName, count]) => itemName !== 'Unknown' && itemName !== 'Unknown:') // กรอง 'Unknown' ออก
                                .map(([itemName, count]) => `   - ${itemName}: ${count} ชิ้น`)
                                .join('\n');
                            return `${setName}:\n${setItemDetails}`;
                        })
                        .join('\n\n');

                    return `${divisionName}:\n${itemDetails}\n\n${setDetails}`;
                })
                .join('\n\n');

            console.log('itemSummary to mail', itemSummary)


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
        const data = await prisma.borrow.findMany({
            include: {
                origanization: true,
                Borrow_detail: {
                    include: {
                        item: { include: { division: true, postfix: true, qr: true } },
                        set: {
                            include: {
                                Item_set: {
                                    include: {
                                        item: {
                                            include: { division: true, postfix: true, qr: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // ปรับข้อมูลเพื่อกรอง Item_set ให้ตรงกับข้อมูล Borrow_detail
        data.forEach((borrow) => {
            if (borrow.Borrow_detail) {
                borrow.Borrow_detail.forEach((detail) => {
                    if (detail.set && detail.set.Item_set) {
                        // กรอง Item_set ให้มีเฉพาะ item ที่เกี่ยวข้องกับ Borrow_detail นี้
                        detail.set.Item_set = detail.set.Item_set.filter((itemSet) =>
                            detail.itemId === itemSet.itemId
                        );
                    }
                });
            }
        });

        return NextResponse.json({ data: data, status: 200 });
    } catch (e) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + e, status: 500 });
    }
}