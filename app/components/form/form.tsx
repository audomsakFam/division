'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { EnterIcon } from "@radix-ui/react-icons"

export const Form = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || process.env.NEXT_PUBLIC_BASE_PATH + '/pages/admin/home'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await signIn('credentials', {
                redirect: false,
                username,
                password
            })

            if (result?.error) {
                console.error(result.error);
                setError(result.error);
                return false
            } else {
                router.push(callbackUrl);
            }
        } catch (err) { console.log('error from user login ====>>>> ', err, ' <<<<====') }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-12 w-full sm:w-[400px]">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="Username">Username</Label>
                <Input
                    className="w-full"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="Username"
                    type="text"
                    autoComplete="off" 
                />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="Password">Password</Label>
                <Input
                    className="w-full"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="Password"
                    type="password"
                />
            </div>
            {error && <Alert>{error}</Alert>}
            <div className="w-full">
                <Button className="flex items-center justify-center w-full bg-blue-900 hover:bg-blue-200 hover:text-stone-900" size="lg">
                    <EnterIcon className="mr-2" />Login
                </Button>
            </div>
        </form>
    )
}