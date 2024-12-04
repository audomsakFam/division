import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from 'fs';

async function writeImageToPublic(fileName: string, imageBuffer: Buffer) {
    const filePath = path.join(process.cwd(), 'public', 'images', 'items', fileName);
    try {
        fs.writeFileSync(filePath, imageBuffer);
        console.log('Image written successfully');
    } catch (err) {
        console.error('Error writing image:', err);
        throw new Error('Unable to write image');
    }
}

export async function POST(req: Request) {
    try {
        const fData = await req.formData();

        // อ่านข้อมูลไฟล์
        const fileUpload = fData.get("image");
        if (!fileUpload || !(fileUpload instanceof File)) {
            return NextResponse.json({ error: "Image file is required", status: 400 });
        }

        // อัปโหลดรูปภาพ
        const arrayBuffer = await fileUpload.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = fileUpload.name;
        const filePath = `../../../../images/items/${fileName}`; // เส้นทางสำหรับเก็บไฟล์
        await writeImageToPublic(fileName, buffer);

        // อ่านข้อมูล JSON สำหรับการสร้าง items
        const name = fData.get("name");
        const division = fData.get("division");
        const postfix = fData.get("postfix");
        const count = fData.get("count");

        if (!name || !division || !postfix || !count) {
            return NextResponse.json({ error: "Missing required fields", status: 400 });
        }

        const divisionId = await prisma.division.findFirst({ where: { name: division.toString() } })
        const postfixId = await prisma.postfix.findFirst({ where: { name: postfix.toString() } })

        console.log('d--->>>', divisionId)
        console.log('p--->>>', postfixId)

        const itemsToClone = Array.from({ length: Number(count) }, () => ({
            name: String(name),
            img: filePath,
            divisionId: Number(divisionId?.id),
            postfixId: Number(postfixId?.id),
        }));
        // สร้าง items พร้อมกับเส้นทางรูปภาพ
        console.log('data--->>>', itemsToClone);
        const newItem = await prisma.items.createMany({
            data: itemsToClone
        });

        return NextResponse.json({ msg: "Item successfully created", item: newItem, status: 201 });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ error: "Something went wrong", status: 500 });
    }
}

// export async function PUT(itemId: number, req: Request) {
//     try {
//         const fData = await req.formData();

//         // อ่าน ID ของ item
//         const itemId = fData.get("itemId");
//         if (!itemId || isNaN(Number(itemId))) {
//             return NextResponse.json({ error: "Invalid item ID", status: 400 });
//         }

//         // อ่านข้อมูลไฟล์
//         const fileUpload = fData.get("image");
//         if (!fileUpload || !(fileUpload instanceof File)) {
//             return NextResponse.json({ error: "Image file is required", status: 400 });
//         }

//         const arrayBuffer = await fileUpload.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         await writeImageToPublic(fileUpload.name, buffer);
//         const filePath = `../../../../images/items/${fileUpload.name}`

//         // อัปเดต item ในฐานข้อมูล
//         const data = await prisma.items.update({
//             where: { id: Number(itemId) },
//             data: { img: filePath },
//         });

//         return NextResponse.json({ msg: "Image successfully uploaded", item: data, status: 200 });
//     } catch (err) {
//         console.error("Error:", err);
//         return NextResponse.json({ error: "Something went wrong", status: 500 });
//     }

// }