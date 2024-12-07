import prisma from "@/lib/db"; // import Prisma client
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    const url = new URL(req.url);
    try {
        const { name, lastname, email, username, password, gender, tel, role } = await req.json();
        if (!name || !lastname || !username || !password || !gender || !tel) {
            return NextResponse.json({ error: 'Missing required fields', status: 400 });
        }
        const image = gender == 'ชาย' ? 'images/male.png' : 'images/female.png'
        const hashedPassword = await bcrypt.hash(password, 9);
        const user = await prisma.user.create({
            data: {
                name,
                lastname,
                email,
                username,
                password: hashedPassword,
                gender,
                tel,
                role,
                image
            },
        });
        return NextResponse.json(user, { status: 201 }); //Created
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'someting went worng at ' + url.href, status: 500 });
    }
};