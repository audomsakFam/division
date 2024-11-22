'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
const router = useRouter();
    return (
        <>
            <div>
                Enter
            </div>
            <Button onClick={() => router.push('/pages/admin/login')}>
                Login
            </Button>
        </>
    );
}