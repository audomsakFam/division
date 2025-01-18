import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { itemName, setId } = await req.json();

        const findItem = await prisma.items.findMany({
            where: {
                name: itemName
            }
        })

        if (findItem.length == 0) {
            return NextResponse.json({ error: 'Item not found', status: 404 });
        }

        const itemData = findItem.map((item) => ({
            setId,
            itemId: item.id
        }));

        const data = await prisma.item_set.createMany({
            data: itemData
        })

        return NextResponse.json({ res: data, msg: 'success', status: 200 });

    } catch (err) {
        console.log({ errpr: `somting went wrong at ${url.href}`, status: 500 });
    }
}