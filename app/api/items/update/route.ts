import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const url = new URL(req.url);
    try {
        const { name, img } = await req.json();
        const result = await prisma.items.updateMany({
            where: {
                name: name
            },
            data: {
                img: img
            }
        })

        return NextResponse.json(result, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + error, status: 500 });
    }
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { newName, name, division, status, postfix } = await req.json();

        console.log('req======>', newName, name, division, status)

        const totalItems = await prisma.items.count({
            where: { name: name },
        });

        const divisionId = await prisma.division.findFirst({ where: { name: division } }) // .then((res) => res?.id)
        const postfixId = await prisma.postfix.findFirst({ where: { name: postfix } }) // .then((res) => res?.id)

        const totalNewStatus =
            status.normal + status.borrowed + status.damaged + status.lost;

        if (totalItems !== totalNewStatus) {
            return NextResponse.json({ error: 'Sum of statuses must equal total items count. at' + url.href, status: 500 });
        }

        const items = await prisma.items.findMany({
            where: { name: name },
        });

        const updates = { ...status };

        // กระจายสถานะใหม่
        const updatedItems = items.map((item) => {
            const currentStatus = item.status as keyof typeof updates;

            if (updates[currentStatus] > 0) {
                updates[currentStatus] -= 1;
                return item;
            }

            for (const key of Object.keys(updates) as (keyof typeof updates)[]) {
                if (updates[key] > 0) {
                    updates[key] -= 1;
                    return {
                        ...item, name: newName,
                        divisionId: divisionId?.id,
                        postfixId: postfixId?.id
                        , status: key == 'normal' ? 'ปกติ' : key == 'borrowed' ? 'ถูกยืม' : key == 'damaged' ? 'ชำรุด' : 'หาย'
                    };
                }
            }

            return item;
        });

        const transaction = updatedItems.map((item) =>
            prisma.items.update({
                where: { id: item.id },
                data: { status: item.status?.toString(), name: newName, divisionId: divisionId?.id },
            })
        );

        await prisma.$transaction(transaction);

        return NextResponse.json({ msg: 'success', data: updatedItems, status: 200 });

    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
} 