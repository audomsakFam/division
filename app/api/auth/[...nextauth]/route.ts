import prisma from "@/lib/db";
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { PrismaAdapter } from "@auth/prisma-adapter";

const authOption: AuthOptions = {
    providers: [ // การกำหนดวิธีการยืนยันตัวตนของผู้ใช้
        CredentialsProvider // เป็น provider ที่ใช้สำหรับการล็อกอินโดยใช้ข้อมูลรับรอง (credentials) ของผู้ใช้โดยตรง
            ({
                name: "Credentials",
                credentials: {
                    username: { label: "Username", type: "text" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials) {

                    if (!credentials) return null;

                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username },
                    });

                    if (!user) {
                        throw new Error('Invalid username or password');
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordValid) {
                        const { id, name, lastname, email, role, gender, image, tel, username, password } = user;
                        return { id: id.toString(), name, lastname, email, role, gender, image, tel, username, password };
                    } else {
                        throw new Error('Invalid username or password');
                    }
                }
            }),
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt' // session เก็บเป็น JSON Web Token (JWT)
    },
    callbacks: {
        jwt: async ({ token, trigger, user, session }: any) => {
            if (trigger === "update" && session) {
                token.id = session.id;
                token.role = session.role;
                token.gender = session.gender;
                token.image = session.image;
                token.name = session.name;
                token.lastname = session.lastname;
                token.email = session.email;
                token.username = session.username;
                token.password = session.password;
                token.tel = session.tel;
            }

            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.gender = user.gender;
                token.image = user.image;
                token.name = user.name;
                token.lastname = user.lastname;
                token.email = user.email;
                token.username = user.username;
                token.password = user.password;
                token.tel = user.tel;
            }

            return token;
        },
        session: async ({ session, token }: any) => { // รับ session ยืนยันว่าเป็น user คนไหนผ่าน token.email เพื่อเรียกใช้
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.gender = token.gender;
                session.user.image = token.image;
                session.user.name = token.name;
                session.user.lastname = token.lastname;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.password = token.password;
                session.user.tel = token.tel;
            }
            return session;
        }
    }
}

const handler = NextAuth(authOption);

export { handler as GET, handler as POST }

