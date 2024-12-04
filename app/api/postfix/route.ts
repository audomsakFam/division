import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const data = await prisma.postfix.findMany();
        return NextResponse.json({ data: data, status: 200 });
    } catch (e) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + e, status: 500 });
    }
}