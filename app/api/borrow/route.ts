import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from 'fs';

async function writeImageToPublic(fileName: string, imageBuffer: Buffer) {
    const filePath = path.join(process.cwd(), 'public', 'images', 'sign', fileName);
    try {
        fs.writeFileSync(filePath, imageBuffer);
        console.log('Image written successfully');
    } catch (err) {
        console.error('Error writing image:', err);
        throw new Error('Unable to write image');
    }
}


export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const fData = await req.formData();

        // ดึงข้อมูลจาก formData
        const name = fData.get("name")?.toString();
        const lastname = fData.get("lastname")?.toString();
        const tel = fData.get("tel")?.toString();
        const otherTel = fData.get("otherTel")?.toString();
        const mentor_name = fData.get("mentor_name")?.toString();
        const mentor_last = fData.get("mentor_last")?.toString();
        const project = fData.get("project")?.toString();
        const serveAt = fData.get("serveAt")?.toString();
        const type_borrow = fData.get("type_borrow")?.toString();
        const retureAt = fData.get("retureAt")?.toString();
        const origanizationId = fData.get("origanizationId")?.toString();
        const borrowDetails = JSON.parse(fData.get("borrowDetails")?.toString() || "[]");

        const fileUpload = fData.get("image");
        const borrower_id = fData.get("borrower_id");
        let filePath = '';
        let filePath2 = '';
        if (fileUpload && fileUpload instanceof File) {
            const arrayBuffer = await fileUpload.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileName = new Date().getTime().toLocaleString() + fileUpload.name;
            filePath = `images/sign/${fileName}`;
            await writeImageToPublic(fileName, buffer);
        }
        if (borrower_id && borrower_id instanceof File) {
            const arrayBuffer = await borrower_id.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileName = new Date().getTime().toLocaleString() + borrower_id.name;
            filePath2 = `images/sign/${fileName}`;
            await writeImageToPublic(fileName, buffer);
        }



        // ตรวจสอบข้อมูลที่จำเป็น
        if (!borrowDetails || borrowDetails.length === 0) {
            return NextResponse.json({ error: 'No borrow details provided' }, { status: 400 });
        }

        if (!name || !lastname || !tel || !project || !serveAt || !retureAt || !origanizationId) {
            return NextResponse.json({ error: 'Missing required fields', status: 400 });
        }
        console.log('detail-=-=-=-=>>>>>>>>>>>>>>>>>>>', borrowDetails.set);
        const result = await prisma.$transaction(async (tx) => {
            // 1. สร้าง Borrow
            const createdBorrow = await tx.borrow.create({
                data: {
                    name: name,
                    lastname: lastname,
                    tel: tel,
                    other_tel: otherTel || '-',
                    mentor_last: mentor_last || '-',
                    mentor_name: mentor_name || '-',
                    borrower_id: filePath2,
                    project: project,
                    serveAt: new Date(serveAt),
                    retureAt: new Date(retureAt),
                    type_borrow: type_borrow,
                    origanizationId: Number(origanizationId),
                    img_sign: filePath
                },
                include: {
                    origanization: true
                }
            });

            // 2. สร้าง Borrow_detail
            for (const detail of borrowDetails) {

                if (detail.setId && detail.set?.Item_set) {
                    // เพิ่ม Borrow_detail สำหรับ `setId` และ `Item_set`
                    for (const itemSet of detail.set.Item_set) {
                        const items = await prisma.items.findMany({
                            where: {
                                name: itemSet.itemName,
                                status: 'ปกติ'
                            },
                            take: itemSet.value, // ดึงรายการตามจำนวน value
                        });

                        if (items.length > 0) {
                            // สร้าง borrow_detail สำหรับแต่ละ item
                            for (const item of items) {
                                await tx.borrow_detail.create({
                                    data: {
                                        borrowId: createdBorrow.id,
                                        itemId: item.id, // ใช้ item.id จาก items
                                    },
                                });
                            }
                        } else {
                            console.error(`จำนวน items ไม่เพียงพอ: ต้องการ ${detail.value} แต่พบ ${items.length}`);
                            throw new Error(`ไม่สามารถดำเนินการได้: จำนวน items ไม่เพียงพอ`);
                        }
                    }
                } else if (detail.itemName) {
                    // เพิ่ม Borrow_detail สำหรับ `itemName` เดี่ยว
                    const items = await prisma.items.findMany({
                        where: {
                            name: detail.itemName,
                            status: 'ปกติ'
                        },
                        take: detail.value, // ดึงรายการตามจำนวน value
                    });

                    if (items.length > 0) {
                        // สร้าง borrow_detail สำหรับแต่ละ item
                        for (const item of items) {
                            await tx.borrow_detail.create({
                                data: {
                                    borrowId: createdBorrow.id,
                                    itemId: item.id, // ใช้ item.id จาก items
                                },
                            });
                        }
                    } else {
                        console.error(`จำนวน items ไม่เพียงพอ: ต้องการ ${detail.value} แต่พบ ${items.length}`);
                        throw new Error(`ไม่สามารถดำเนินการได้: จำนวน items ไม่เพียงพอ`);
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
            try {
                if (result.Borrow_detail.length > 0) {
                    console.log("in if -=-==--=-=-=-=-=-==-=-=-=-=-=-\n", result.Borrow_detail);
                    console.log("in if flatMap -=-==--=-=-=-=-=-==-=-=-=-=-=-\n", result.Borrow_detail.flatMap((detail) => detail.item?.id || []));
                    await Promise.all(
                        result.Borrow_detail.map(async (itemInResult: any) => {
                            try {
                                const updatedItem = await prisma.items.update({
                                    where: { id: itemInResult.item.id },
                                    data: { status: 'ถูกยืม' },
                                });
                                console.log('Updated item:', updatedItem);
                            } catch (error) {
                                console.error('Error updating item:', itemInResult.item, error);
                            }
                        })
                    );
                } else {
                    console.error('No valid item IDs to update');
                }
            } catch (error) {
                console.error('Error in Promise.all:', error);
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
        })


        // ปรับข้อมูลเพื่อกรอง Item_set ให้ตรงกับข้อมูล Borrow_detail
        data.forEach((borrow: any) => {
            if (borrow.Borrow_detail) {
                borrow.Borrow_detail.forEach((detail: any) => {
                    if (detail.set && detail.set.Item_set) {
                        // กรอง Item_set ให้มีเฉพาะ item ที่เกี่ยวข้องกับ Borrow_detail นี้
                        detail.set.Item_set = detail.set.Item_set.filter((itemSet: any) =>
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