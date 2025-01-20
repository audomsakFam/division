import prisma from "@/lib/db"; // import Prisma client
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

interface UserData {
    email: string;
    name: string;
    lastname: string;
    username?: string;
    tel: string;
    password?: string;
}

export async function PUT(req: Request) {
    const url = new URL(req.url);
    try {
        const { id, name, lastname, tel, email, username, password, oldPassword } = await req.json();
        let hashedPassword;
        if(oldPassword) {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!user) {
                return NextResponse.json({ error: 'User not found', status: 404 });
            }
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return NextResponse.json({ error: 'Invalid old password', status: 401 });
            }
        }
        console.log("body req ---------\n", `id ${id}`, `name ${name}`, `lastname ${lastname}`, `tel ${tel}`, `email ${email}`, `username ${username}`, `password ${password}`)
        if (!id || !name || !lastname || !tel || !email) {
            return NextResponse.json({ error: 'Missing required fields', status: 400 });
        }
        if (password) {
            hashedPassword = await bcrypt.hash(password, 9);
        }
        const userData: UserData = {
            email,
            name,
            lastname,
            tel,
        };
        if (username) userData.username = username
        // เพิ่ม password ใน `data` เฉพาะเมื่อมีค่า
        if (hashedPassword) {
            userData.password = hashedPassword;
        }

        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: userData,
        });
        return NextResponse.json({ res: user, status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href + err, status: 500 });
    }
}

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

export async function GET(req: Request) {
    const url = new URL(req.url);
    try {
        const data = await prisma.user.findMany();
        return NextResponse.json({ res: data, status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href, status: 500 });
    }
}

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    try {

        const { searchParams } = url;
        const id = searchParams.get('id') || '';
        const data = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });
        return NextResponse.json({ res: data, status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'someting went worng at ' + url.href, status: 500 });
    }
}