import prisma from "@/lib/db";
import { NextResponse } from "next/server"


export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const data = await prisma.origanization.findMany();
        return NextResponse.json({ data: data, msg: 'success', status: 200 });
    } catch (err) {
        return NextResponse.json({error: 'someting went worng at ' + url.href + err, status: 500});
    }
}