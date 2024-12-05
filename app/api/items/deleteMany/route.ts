import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from 'fs';

async function deleteImageFromPublic(fileName: string) {
    
    const filePath = path.join(process.cwd(), 'public', 'images', 'items', path.basename(fileName));
    try {
        fs.unlinkSync(filePath);
        console.log('Image deleted successfully');
    } catch (err) {
        console.error('Error writing image:', err);
        throw new Error('Unable to write image');
    }
}

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    try {
        const { searchParams } = url;
        const name = searchParams.get('name') || '';
        const imgName = searchParams.get('imgName') || '';

        if(!name){
            return NextResponse.json({ error: 'Missing required fields', status: 400 });
        }
        deleteImageFromPublic(imgName);
        await prisma.items.deleteMany({
            where: { name }
        })
        return NextResponse.json({ msg: 'Items deleted successfully', status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}