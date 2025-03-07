import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { email } = await req.json();
        const data = await prisma.mailNoti.create({
            data: {
                email
            }
        })
        return NextResponse.json({ res: data, msg: 'success', status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + error, status: 500 });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const data = await prisma.mailNoti.findMany();
        return NextResponse.json({ res: data, status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + error, status: 500 });
    }
}

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    try {
        const { searchParams } = url;
        const id = searchParams.get('id') || '';
        const data = await prisma.mailNoti.delete({
            where: {
                id: Number(id)
            }
        })
        return NextResponse.json({ res: data, msg: 'deleted success', status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + error, status: 500 });
    }
}
