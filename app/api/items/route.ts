import prisma from "@/lib/db";
import { Items } from "@prisma/client";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const data = await prisma.items.groupBy({
            by: ['name', 'status', 'divisionId', 'postfixId', 'img'], // กำหนดให้ทำการ group by ตามฟิลด์ที่ต้องการ
            _count: {
                status: true, // นับจำนวนของแต่ละสถานะ
            },
            orderBy: {
                name: 'asc',}
        })

        const divisions = await prisma.division.findMany(); // ดึงข้อมูล division ทั้งหมด
        const postfixes = await prisma.postfix.findMany(); // ดึงข้อมูล postfix ทั้งหมด
        // const qrs = await prisma.qr.findMany(); // ดึงข้อมูล qr ทั้งหมด
        // สร้าง finalResult โดยใช้ข้อมูลที่ได้จาก groupBy, division, และ postfix
        const finalResult = data.reduce<Items[]>((acc, item) => {
            // หาค่าที่สัมพันธ์กับ divisionId
            const division = divisions.find(div => div.id === item.divisionId);

            // หาค่าที่สัมพันธ์กับ postfixId
            const postfix = postfixes.find(pf => pf.id === item.postfixId);


            // ค้นหากลุ่มที่มี name ซ้ำกัน
            let existingGroup = acc.find(group => group.name === item.name) as any;

            if (!existingGroup) {
                // ถ้าไม่มีกลุ่มที่ชื่อเหมือนกัน, สร้างกลุ่มใหม่
                existingGroup = {
                    name: item.name,
                    statusCounts: [],
                    divisionName: division ? division.name : null,
                    postfixName: postfix ? postfix.name : null,
                    img: item.img
                    // createAt: item.createAt,
                };
                acc.push(existingGroup as never);
            }

            // เพิ่มข้อมูลเกี่ยวกับ status และจำนวนที่สัมพันธ์กับสถานะ
            existingGroup.statusCounts.push({
                status: item.status,
                count: item._count.status,
            });

            return acc;
        }, []);
        return NextResponse.json(finalResult, {
            status: 200
        })
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { itemId, cloneCount } = await req.json();

        const originalItem = await prisma.items.findUnique({
            where: { id: itemId },
        });

        if (!originalItem) {
            return NextResponse.json({ error: 'Item not found', status: 404 });
        }

        const itemsToClone = Array.from({ length: cloneCount }, () => ({
            name: originalItem.name,
            img: originalItem.img,
            status: originalItem.status,
            divisionId: originalItem.divisionId,
            postfixId: originalItem.postfixId,
        }));

        const result = await prisma.items.createMany({
            data: itemsToClone,
        });

        return NextResponse.json({ msg: 'Items cloned successfully', data: result, status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    try {
        const { searchParams } = url;
        const name = searchParams.get('name') || '';
        const deleteCount = parseInt(searchParams.get('count') || '0', 10);

        // ค้นหา Items ที่ต้องการลบ
        const itemsToDelete = await prisma.items.findMany({
            where: { name: name },
            take: deleteCount,
        });
        if (!itemsToDelete || itemsToDelete.length === 0) {
            return NextResponse.json({ error: 'No items found to delete at' + url.href, status: 404 });
        }

        // ลบ Items
        const result = await prisma.items.deleteMany({
            where: {
                id: { in: itemsToDelete.map((item) => item.id) },
            },
        });
        return NextResponse.json({ msg: 'Items deleted successfully', data: result, status: 200 });

    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}