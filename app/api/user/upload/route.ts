import path from "path";
import fs from 'fs';
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

async function writeImageToPublic(fileName: string, imageBuffer: Buffer) {
    const filePath = path.join(process.cwd(), 'public', 'images', 'profile', fileName);
    try {
        fs.writeFileSync(filePath, imageBuffer);
        console.log('Image written successfully');
    } catch (err) {
        console.error('Error writing image:', err);
        throw new Error('Unable to write image');
    }
}

export async function PUT(req: Request) {
    const url = new URL(req.url);
    try {
        const fData = await req.formData();
        const fileUpload = fData.get("image");
        const id = fData.get("id");

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid item ID", status: 400 });
        }

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(id),
            },
            select: {
                image: true
            }
        });


        if (findUser && findUser.image != 'male.png' && findUser.image != 'female.png') {
            const filePath = path.join(process.cwd(), 'public', 'images', 'profile', findUser.image);
            try {
                fs.unlinkSync(filePath);
                console.log('Image deleted successfully');
            } catch (err) {
                console.error('Error deleted image:', err);
                throw new Error('Unable to deleted image');
            }
        }



        if (!fileUpload || !(fileUpload instanceof File)) {
            return NextResponse.json({ error: "Image file is required", status: 400 });
        }

        const arrayBuffer = await fileUpload.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${new Date().getTime().toLocaleString()}-${fileUpload.name}`;
        await writeImageToPublic(fileName, buffer);
        console.log('fileName---> ', fileName)

        const data = await prisma.user.update({
            where: { id: Number(id) },
            data: { image: fileName },
        });

        return NextResponse.json({ msg: "Image successfully uploaded", res: data, status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}