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
