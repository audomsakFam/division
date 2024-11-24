import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(req: Request) {
    const url = new URL(req.url);
    try {
        const id = Number(url.pathname.split('/').pop());

        const find = await prisma.borrow.findUnique({
            where: { id: id },
            include: {
                Borrow_detail: {
                    include: {
                        set: {
                            include: {
                                Item_set: {
                                    include: {
                                        item: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!find) {
            return NextResponse.json({ error: 'Borrow not found' }, { status: 404 });
        }

        const itemIds = find.Borrow_detail
            .flatMap((detail) => {
                // รวม itemId จาก Borrow_detail และ item IDs จาก Item_set
                const individualItemId = detail.itemId ? [detail.itemId] : [];
                const setItemIds = detail.set?.Item_set.map((setItem) => setItem.item.id) || [];
                return [...individualItemId, ...setItemIds];
            })
            .filter((itemId): itemId is number => itemId !== null); // กรอง null และให้ TypeScript รู้ว่า itemId เป็น number

        if (itemIds.length > 0) {
            await prisma.items.updateMany({
                where: {
                    id: { in: itemIds },
                },
                data: {
                    status: 'ปกติ',
                },
            });
        }

        await prisma.borrow_detail.deleteMany({
            where: {
                borrowId: id,
            },
        });

        await prisma.borrow.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({ message: 'Borrow deleted successfully' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}