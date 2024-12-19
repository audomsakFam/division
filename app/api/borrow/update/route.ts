import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { id, itemUpdates } = await req.json();
    const url = new URL(req.url);
    try {
        // สร้าง array ของ promises สำหรับการอัปเดต items
        const itemUpdatePromises = itemUpdates.map((item: { id: number; status: string }) => [
            prisma.items.update({
                where: { id: item.id },
                data: { status: item.status },
            }),
            prisma.borrow_detail.updateMany({
                where: { borrowId: id, itemId: item.id },
                data: { item_status: item.status },
            }),
        ]).flat();



        // ใช้ prisma.$transaction สำหรับการอัปเดต borrow และ items
        await prisma.$transaction([
            prisma.borrow.update({
                where: { id: id },
                data: { status: 4 },
            }),
            ...itemUpdatePromises, // กระจาย array ของ promises
        ]);

        // return new Response(
        //     JSON.stringify({ success: true, message: "Borrow and items updated successfully" }),
        //     { status: 200 }
        // );
        return NextResponse.json({ message: "Borrow and items updated successfully", status: 200 });
    } catch (error) {
        console.error("Error updating borrow and items:", error);
        return NextResponse.json({ message: "someting went worng at " + url.href, status: 200 });
    }
}

export async function PUT(req: Request) {
    const url = new URL(req.url);
    try {
        const { id } = await req.json();
        const data = await prisma.borrow.findUnique({ where: { id: id } });
        if (data?.status == 0) {
            await prisma.borrow.update({
                where: { id: id },
                data: { status: 2 },
            });
            return NextResponse.json({ msg: 'update to "to waiting"', status: 200 });
        }
        if (data?.status == 1) {
            const data2 = await prisma.borrow.update({
                where: { id: id },
                data: { status: 2 },
            });
            console.log('update to "to serve"', data2);
            return NextResponse.json({ msg: 'update to "to serve"', status: 200 });
        }

        if (data?.status == 2) {
            await prisma.borrow.update({
                where: { id: id },
                data: { status: 3 },
            });
            return NextResponse.json({ msg: 'update to "to return"', status: 200 });
        }
        return NextResponse.json({ status: 200 });
    } catch (e) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + e, status: 500 });
    }
}