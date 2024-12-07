'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClearBorrowCache, ClearItemCache, GetBorrowWithCache, GetItemWithCache } from '@/lib/servers/getItemWithCache';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
const NotificationAlert = ({ borrowId, msg, status, onUpdate }: { borrowId: number, msg: string, status: number, onUpdate: () => void }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        ClearBorrowCache();
        ClearItemCache();
        const timer = setTimeout(async () => {
            setMessage(`${msg}`);
            setShowAlert(true);
            if (status == 0) {
                await axios.put(process.env.NEXT_PUBLIC_BASE_PATH+'/api/borrow/update', { id: borrowId })
                    .then((response) => {
                        if (response.status === 200) {
                            console.log('Borrow status updated successfully');
                        } else {
                            console.error('Error updating borrow status');
                        }
                    }).catch((error) => {
                        console.error('Failed to update borrow status:', error);
                    });
            }
            GetBorrowWithCache();
            GetItemWithCache();
            onUpdate();
        }, 1000); // แสดงการแจ้งเตือนหลังจาก 1 วินาที (สามารถเปลี่ยนเวลาได้)

        const clearTimer = setTimeout(() => {
            setShowAlert(false);
        }, 6000); // ลบการแจ้งเตือนหลังจาก 6 วินาที
        return () => {
            clearTimeout(timer);
            clearTimeout(clearTimer);
        };
    }, [borrowId, msg, status]);

    if (!showAlert) return null;

    return (
        <div className="fixed bottom-5 right-10 ">
            <Alert className='bg-blue-900 text-slate-100 shadow-lg w-96'>
                <AlertTitle className='flex'>Notification <FaCircleExclamation className='ml-2 text-yellow-500' /></AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        </div>
    );
};

export default NotificationAlert;
