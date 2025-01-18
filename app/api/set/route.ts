import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const data = await prisma.set.findMany();

        return NextResponse.json({ data: data, status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { name } = await req.json();

        const data = await prisma.set.create({
            data: {
                name,
            }
        })

        return NextResponse.json({ res: data, msg: 'success', status: 200 });
    } catch (err) {
        console.log({ errpr: `somting went wrong at ${url.href}`, status: 500 });
    }
}

export async function DELETE(req: Request) {
    const url = new URL(req.url)
    try {
        const { searchParams } = url;
        const id = searchParams.get('id') || '';
        const findSet = await prisma.item_set.findMany({
            where: {
                setId: Number(id)
            }
        })
        if(findSet.length > 0){
            await prisma.item_set.deleteMany({
                where: {
                    setId: Number(id)
                }
            })
        }
        const data = await prisma.set.delete({
            where: { id: Number(id) }
        })

        return NextResponse.json({ res: data, msg: 'deleted success', status: 200 });
    } catch (err) {
        console.log({ errpr: `somting went wrong at ${url.href}`, status: 500 });
    }
}