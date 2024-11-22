'use client'
import { Form as LoginForm } from '../../../components/form/form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from "next/image"

export default function Login() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status == 'authenticated') router.push('/pages/admin/home');
  }, [router, status])
  return (
    <>
      {console.log('status auth ====>>>>', status)}
      {status == 'unauthenticated' && <div className="h-screen w-screen flex justify-center items-center bg-blue-900">
        <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12 text-blue-950">
          <div className='flex justify-start items-center'>
            <Image width={50} height={50} src="/images/logoRMUTT.png" alt="Image" className="rounded-md object-cover mb-3" />
            <div className='flex flex-col ml-2'>
              <h1 className="font-semibold text-2xl">Login</h1>
              <p className='text-stone-400'>for admin only.</p>
            </div>
          </div>
          <LoginForm />
          {/* <p className="text-center">
            Need to create an account?{' '}
            <Link className="text-indigo-500 hover:underline" href="/Register">
              Create Account
            </Link>{' '}
          </p> */}
        </div>
      </div>}
    </>
  )
}