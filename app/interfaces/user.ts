export interface CustomUserSession {
    user: CustomUser;
}

export interface CustomUser {
    id: number
    email: string
    username: string
    tel: string
    name: string
    image: string
    lastname: string
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
