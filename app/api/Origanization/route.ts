import prisma from "@/lib/db";
import { NextResponse } from "next/server"


export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const data = await prisma.origanization.findMany();
        return NextResponse.json({ data: data, msg: 'success', status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    try {
        const { searchParams } = url;
        const id = searchParams.get('id') || '';

        const res = await prisma.origanization.delete({
            where: { id: Number(id) }
        })
        return NextResponse.json({ res: res, msg: 'deleted success', status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + error, status: 500 });
    }
}

export async function POST(req: Request) {
    const url = new URL(req.url)
    try {
        const { name, group } = await req.json();

        if (!name || !group) {
            return NextResponse.json({ error: 'Missing required fields', status: 400 });
        }

        const data = await prisma.origanization.create({
            data: {
                name,
                group
            }
        })

        return NextResponse.json({ res: data, msg: 'success', status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + error, status: 500 });
    }
}