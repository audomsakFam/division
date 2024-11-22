import prisma from "@/lib/db";
import { NextResponse } from "next/server";

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
                qr: true
            }
        });
        if (items.length > 0) {
            return NextResponse.json({ msg: 'success', data: items, status: 200 });
        } else {
            return NextResponse.json({ msg: 'not found', data: [], status: 404 });
        }
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}