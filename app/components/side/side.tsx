'use client'

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ExitIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomUserSession } from "../../interfaces/user";
import { FaBars, FaBoxesPacking, FaBoxesStacked, FaHouse } from "react-icons/fa6";
import Image from "next/image";
import NotificationAlert from "../notificationAlter/notificationAlter";
import { ClearBorrowCache, ClearItemCache } from "@/lib/servers/getItemWithCache";
import { useRefresh } from "@/app/context/refreshProvider";

interface SideProps {
    children: React.ReactNode;
}


export default function Side({ children }: SideProps) {

    const { data, status } = useSession();
    const [pageOn, setPageOn] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const session = data as CustomUserSession | null;
    const router = useRouter();
    const pathname = usePathname();
    const [notifications, setNotifications] = useState<string>('');
    const [borrowId, setBorrowId] = useState<number>(0);
    const [borrowStatus, setBorrowStatus] = useState<number>(0);
    const [sseConnection, setSSEConnection] = useState<EventSource | null>(null);
    const { setRefreshData } = useRefresh();

    const handleUpdateData = () => {
        setRefreshData(true);  // รีเซ็ตให้ `Home` รู้ว่าให้รีเฟรชข้อมูล
    };
    const handleLogout = () => {
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
            });
            console.log("Cache cleared!");
        }
        ClearItemCache();
        ClearBorrowCache();
        signOut({ callbackUrl: '/pages/admin/login' });
    };


    const startSSEConnection = useCallback(() => {
        console.log('Initializing SSE connection...');
        const eventSource = new EventSource('http://localhost:9000/api/noti');

        eventSource.onopen = () => {
            console.log('SSE connection opened.');
        };

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setNotifications(data.message);
            setBorrowId(data.borrowId);
            setBorrowStatus(data.status);
        };

        eventSource.onerror = (event) => {
            console.error('SSE Error:', event);
            eventSource.close();
            // Attempt to reconnect after a delay
            setTimeout(() => {
                console.log('Reconnecting SSE...');
                startSSEConnection(); // Restart the connection
            }, 3000); // Reconnect after 3 seconds
        };

        setSSEConnection(eventSource);
    }, []);

    useEffect(() => {
        startSSEConnection();
        return () => {
            console.log('Cleaning up SSE connection...');
            if (sseConnection) {
                sseConnection.close();
            }
        };
    }, [startSSEConnection]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false); // ปิด sidebar หากคลิกนอก sidebar
            }
        };

        if (sidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    useEffect(() => {
        const pathSegments = pathname.split('/').filter(Boolean).pop();
        setPageOn(pathSegments!);
        console.log("paht ==>", pathSegments)
        if (status == 'unauthenticated') router.push('/pages/admin/login');
    }, [router, status])

    return (
        <>
            {session && session.user && (
                <>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="inline-flex items-center p-2 mt-2 ms-3  text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        {/* <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> */}
                        <div className="w-6 h-6">
                            <FaBars className="w-6 h-6" />
                        </div>
                        {/* </svg> */}
                    </button>
                    <aside ref={sidebarRef} className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-blue-950 text-slate-100 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } lg:translate-x-0`} aria-label="Sidebar">
                        <div className="flex justify-around w-full bg-blue-900 text-slate-100" onClick={() => router.push('/pages/admin/home')} >
                            <div className="flex w-full items-center mb-5 cursor-pointer m-5">
                                <Avatar className="w-12 h-12 rounded-full overflow-hidden mb-2 mr-4">
                                    <AvatarImage className="w-full h-full object-cover" src={session.user.image} />
                                </Avatar>
                                <h1><b>{session.user.name}</b></h1>
                            </div>
                            <div className="m-5">
                                <Image width={60} height={60} src="/images/logoRMUTT.png" alt="Image" className="rounded-md object-cover mb-3" />
                            </div>
                        </div>
                        <div className="h-full px-3 py-4 overflow-y-auto bg-blue-950 text-slate-100 flex flex-col justify-between">
                            <ul className="space-y-2 font-medium">
                                {/* <li>
                               
                            </li> */}
                                <li>
                                    <Button onClick={() => router.push('/pages/admin/home')} variant="ghost" className={`w-full justify-start mb-2 ${pageOn === 'home' ? 'bg-accent text-accent-foreground' : ''}`}>
                                        <FaHouse className="mr-2" />หน้าแรก
                                    </Button>
                                </li>
                                <li>
                                    <Button onClick={() => router.push('/pages/admin/items')} variant="ghost" className={`w-full justify-start mb-2 ${pageOn === 'items' ? 'bg-accent text-accent-foreground' : ''}`}>
                                        <FaBoxesStacked className="mr-2" />อุปกรณ์
                                    </Button>
                                </li>
                                <li>
                                    <Button onClick={() => router.push('/pages/admin/borrowReturn')} variant="ghost" className={`w-full justify-start mb-2 ${pageOn === 'borrowReturn' ? 'bg-accent text-accent-foreground' : ''}`}>
                                        <FaBoxesPacking className="mr-2" />รายการที่ส่งคืนแล้ว
                                    </Button>
                                </li>
                            </ul>
                            <div className="flex items-center justify-center h-1/4 mt-5 w-full mb-20">
                                {/* <Button className="flex items-center justify-center w-full" type="button" variant="destructive" onClick={() => signOut({ callbackUrl: '/' ,})}> */}
                                <Button className="flex items-center justify-center w-full" type="button" variant="destructive" onClick={() => handleLogout()}>
                                    <ExitIcon className="mr-2" />Logout
                                </Button>
                            </div>
                        </div>
                    </aside>
                    <div className="p-4 lg:ml-64 flex-grow bg-blue-50 p-4 overflow-y-auto h-screen text-stone-900">
                        {children}
                        {notifications && borrowId != 0 && (<NotificationAlert borrowId={borrowId} msg={notifications} status={borrowStatus} onUpdate={handleUpdateData} />)}

                    </div>
                </>
            )}
        </>

    );
}