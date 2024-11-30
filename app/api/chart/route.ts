import prisma from "@/lib/db";
import { NextResponse } from "next/server";


const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const { searchParams } = url;
        const year = parseInt(searchParams.get('year') || `${new Date().getFullYear()}`, 10);
        const divisions = await prisma.division.findMany();
        const data = await prisma.borrow_detail.findMany({
            include: {
                borrow: true,
                item: {
                    include: {
                        division: true
                    }
                }
            },
            where: {
                borrow: {
                    createAt: {
                        gte: new Date(year, 0, 1), // 1 มกราคมของปีที่ระบุ
                        lt: new Date(year + 1, 0, 1), // 1 มกราคมของปีถัดไป
                    },
                    status: 4
                },
            },
        })

        const groupData = divisions.reduce((acc: Record<string, number[]>, division) => {
            acc[division.name] = Array(12).fill(0); // เริ่มต้นข้อมูลเดือนมกราคมถึงธันวาคมเป็น 0
            return acc;
        }, {});

        data.forEach((curr) => {
            const divisionName = curr.item?.division?.name;
            const monthIndex = new Date(curr.borrow.createAt).getMonth();
            if (divisionName) {
                groupData[divisionName][monthIndex] += 1; // เพิ่มจำนวนในเดือนที่ตรงกัน
            }
        });

        // const groupData = data.reduce((acc: Record<string, number[]>, curr) => {
        //     const divisionName = curr.item?.division.name
        //     const mountIndex = new Date(curr.borrow.createAt).getMonth()
        //     if(!divisionName){
        //         return acc
        //     }
        //     if (!acc[divisionName]) {
        //         acc[divisionName] = Array(12).fill(0)
        //     }
        //     acc[divisionName][mountIndex] += 1 // key, value

        //     return acc;
        // }, {})

        const series = Object.keys(groupData).map((divisionName) => ({
            name: divisionName,
            data: groupData[divisionName]
        }))
        return NextResponse.json({
            xaxis: months,
            series,
            status: 200
        });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}