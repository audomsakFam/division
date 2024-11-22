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

