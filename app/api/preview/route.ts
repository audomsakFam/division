import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from 'fs';


async function removeFileFromPublic(fileName: string) {
    // const filePath = path.join(process.cwd(), 'public', fileName);// dev
    const filePath = path.join(process.cwd(), 'public', 'images', fileName);// product
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('File removed successfully');
        } else {
            console.log('File not found, nothing to remove');
        }
    } catch (err) {
        console.error('Error removing image:', err);
        throw new Error('Unable to remove image');
    }
}


async function writeImageToPublic(fileName: string, imageBuffer: Buffer) {
    // const filePath = path.join(process.cwd(), 'public', 'images', fileName);// dev
    const filePath = path.join(process.cwd(), 'public', 'images', fileName);// product
    try {
        fs.writeFileSync(filePath, imageBuffer);
        console.log('File written successfully');
    } catch (err) {
        console.error('Error writing image:', err);
        throw new Error('Unable to write image');
    }
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const fdate = await req.formData();
        const type = Number(fdate.get('type')); // 0 img, 1 video
        const fileUpload = fdate.get('file');

        const find = await prisma.imgAndVideoPreview.findMany({})

        if (find.length > 0) {
            console.log('remove 1')
            if (type == 0) {
                const typeImageL = find.filter(v => v.type === 0);
                if (typeImageL.length > 0) {
                    console.log('remove 2.1')
                    for (const v of typeImageL) {
                        await removeFileFromPublic(v.name);
                        await prisma.imgAndVideoPreview.delete({ where: { id: v.id } });
                    }
                }
            }
            if (type == 1) {
                const typeImageR = find.filter(v => v.type === 1);

                if (typeImageR.length > 0) {
                    console.log('remove 2.2')
                    for (const v of typeImageR) {
                        await removeFileFromPublic(v.name);
                        await prisma.imgAndVideoPreview.delete({ where: { id: v.id } });
                    }
                }
            }
            if (type == 2) {
                const typeVideo = find.filter(v => v.type === 2);

                if (typeVideo.length > 0) {
                    console.log('remove 3')
                    for (const v of typeVideo) {
                        await removeFileFromPublic(v.name);
                        await prisma.imgAndVideoPreview.delete({ where: { id: v.id } });
                    }
                }
            }

        }

        if (!fileUpload || !(fileUpload instanceof File)) {
            return NextResponse.json({ error: 'Image file is required', status: 400 });
        }
        if (isNaN(type)) {
            return NextResponse.json({ error: 'Missing required fields', status: 400 });
        }

        const arrayBuffer = await fileUpload.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = new Date().getTime().toLocaleString() + fileUpload.name;
        const filePath = `images/${fileName}`; // เส้นทางสำหรับเก็บไฟล์
        await writeImageToPublic(fileName, buffer);

        const data = await prisma.imgAndVideoPreview.create({
            data: {
                name: filePath,
                type
            }
        })

        return NextResponse.json({ msg: 'File successfully uploaded', res: data, status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const res = await prisma.imgAndVideoPreview.findMany({});

        // ตัด path ออก เหลือแค่ชื่อไฟล์และนามสกุล
        const modifiedRes = res.map((item: any) => ({
            ...item,
            name: item.name.split('/').pop() // ดึงแค่ชื่อไฟล์
        }));

        return NextResponse.json({ res: modifiedRes, status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'something went wrong at ' + url.href + err, status: 500 });
    }
}
