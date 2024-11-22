export interface CustomUserSession {
    user: CustomUser;
}

interface CustomUser {
    id: number
    email: string
    name: string
    image: string
    password?: string
    role: string
    gender: string
    createdAt: string
    updatedAt: string
}


export interface ResUpdateUser {
    msg: string
    user: CustomUser
    status: number
}
