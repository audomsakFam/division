import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { itemName, setId } = await req.json();

        console.log('data -=-==-> \n', itemName, setId);

        if (!Array.isArray(itemName) || itemName.length === 0) {
            return NextResponse.json({ error: 'itemName must be a non-empty array', status: 400 });
        }

        // กรองค่า undefined หรือ null
        const validNames = itemName
            .filter((item) => item && item.name) // กรองเฉพาะออบเจ็กต์ที่มี name
            .map((item) => item.name);

        if (validNames.length === 0) {
            return NextResponse.json({ error: 'No valid item names found', status: 400 });
        }

        // ค้นหาไอเท็มทั้งหมดที่ตรงกับชื่อในฐานข้อมูล
        const findItems = await prisma.items.findMany({
            where: {
                name: {
                    in: validNames, // ใช้เฉพาะชื่อที่ผ่านการกรองแล้ว
                },
            },
        });

        console.log('data findItems -=-==-> \n', findItems);


        // ตรวจสอบว่าพบไอเท็มหรือไม่
        if (findItems.length === 0) {
            return NextResponse.json({ error: 'No matching items found', status: 404 });
        }

        // ดึงรายการ itemId ที่อยู่ใน setId อยู่แล้ว
        const existingItems = await prisma.item_set.findMany({
            where: { setId },
            select: { itemId: true },
        });
        const existingItemIds = existingItems.map((item) => item.itemId);

        console.log('existing itemIds -=-==-> \n', existingItemIds);

        // สร้างข้อมูลเฉพาะไอเท็มที่ยังไม่เคยอยู่ใน set นี้
        const itemData = findItems
            .filter((item) => !existingItemIds.includes(item.id)) // กรองไอเท็มที่ยังไม่เคยถูกเพิ่ม
            .map((item) => ({
                setId,
                itemId: item.id,
            }));

        console.log('data itemData -=-==-> \n', itemData);

        if (itemData.length === 0) {
            return NextResponse.json({ error: 'All items are already in the set', status: 400 });
        }

        // เพิ่มข้อมูลลงใน item_set
        const data = await prisma.item_set.createMany({
            data: itemData,
        });

        console.log('data createMany -=-==-> \n', data);

        return NextResponse.json({ res: data, msg: 'success', status: 200 });
    } catch (err) {
        console.error({ error: `Something went wrong at ${url.href} ${err}`, status: 500 });
        return NextResponse.json({ error: 'Internal Server Error', status: 500 });
    }
}


export async function DELETE(req: Request) {
    const url = new URL(req.url);

    try {
        const itemName = url.searchParams.get('itemName');
        const setName = url.searchParams.get('setName');

        console.log('Received query params:', { itemName, setName });

        if (!itemName || !setName) {
            return NextResponse.json({ error: 'itemName and setId are required', status: 400 });
        }

        const findItems = await prisma.items.findMany({
            where: {
                name: itemName,
            },
        });

        const findSet = await prisma.set.findFirst({
            where: {
                name: setName,
            }
        })

        console.log('data findItems -=-==-> \n', findItems);

        if (findItems.length === 0 || !findSet) {
            return NextResponse.json({ error: 'No matching items found or set not found', status: 404 });
        }

        const itemIds = findItems.map((item) => item.id);



        const deletedData = await prisma.item_set.deleteMany({
            where: {
                setId: findSet.id,
                itemId: { in: itemIds },
            },
        });

        console.log('data deletedData -=-==-> \n', deletedData);

        if (deletedData.count === 0) {
            return NextResponse.json({ error: 'No matching item_set found to delete', status: 404 });
        }

        return NextResponse.json({ res: deletedData, msg: 'Deleted successfully', status: 200 });
    } catch (err) {
        console.error({ error: `Something went wrong at ${url.href} ${err}`, status: 500 });
        return NextResponse.json({ error: 'Internal Server Error', status: 500 });
    }
}
