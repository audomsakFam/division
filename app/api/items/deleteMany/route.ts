import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    try {
        const { searchParams } = url;
        const name = searchParams.get('name') || '';

        if(!name){
            return NextResponse.json({ error: 'Missing required fields', status: 400 });
        }
        console.log('this is name------>>>',name);
        await prisma.items.deleteMany({
            where: { name }
        })
        return NextResponse.json({ msg: 'Items deleted successfully', status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}