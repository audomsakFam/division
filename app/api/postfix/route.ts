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

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    try {
        const { searchParams } = url;
        const id = searchParams.get('id') || '';

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: 'Invalid ID', status: 400 });
        }
        
        const findItem = await prisma.items.findMany({
            where: {
                postfixId: Number(id)
            }
        })

        if (findItem.length > 0) {
            await Promise.all(findItem.map(async (item) => {
                await prisma.items.update({
                    where: {
                        id: item.id
                    },
                    data: {
                        postfixId: NaN
                    }
                })
            }))
        }

        const res = await prisma.postfix.delete({
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
        const { name } = await req.json();

        const data = await prisma.postfix.create({
            data: {
                name,
            }
        })

        return NextResponse.json({ res: data, msg: 'success', status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + error, status: 500 });
    }
}
