import prisma from "@/lib/db";
import { NextResponse } from "next/server";

import path from 'path';

export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const name = decodeURIComponent(url.pathname.split('/').pop()!);
        const items = await prisma.items.findMany({
            where: {
                name: name
            },
            include: {
                division: true,
                postfix: true,
            }
        });

        if (items.length > 0) {
            const updatedItems = items.map(item => ({
                ...item,
                img: item.img ? path.basename(item.img) : ""  // ดึงแค่ชื่อไฟล์
            }));

            return NextResponse.json({ msg: 'success', data: updatedItems, status: 200 });
        } else {
            return NextResponse.json({ msg: 'not found', data: [], status: 404 });
        }
    } catch (err) {
        return NextResponse.json({ error: 'someting went wrong at ' + url.href + err, status: 500 });
    }
}
