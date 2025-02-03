'use client'

import { ResBorrowData } from "@/app/interfaces/borrow";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import Side from "@/app/components/side/side";
import { Button } from "@/components/ui/button";
import { useRefresh } from "@/app/context/refreshProvider";
import { ClearBorrowCache, GetBorrowWithCache } from "@/lib/servers/getItemWithCache";
import PaginationComponent from "@/app/components/pagination/pagination";
import { useRouter } from "next/navigation";
import { FaCircleMinus } from "react-icons/fa6";
import axios from "axios";

const itemsPerPage = 10;

export default function BorrowReturn() {

    const [borrow, setBorrow] = useState<ResBorrowData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { refreshData, setRefreshData } = useRefresh();
    const router = useRouter();

    useEffect(() => {
        if (refreshData) {
            console.log('working , refreshData ====>>>>', refreshData);
            GetBorrowWithCache().then((res) => setBorrow(
                res.filter((v) => v.status == 4)
                    .sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
            ));
            setRefreshData(false);  // รีเซ็ตค่า refreshData
        }
        GetBorrowWithCache().then((res) => setBorrow(
            res.filter((v) => v.status == 4)
                .sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
        ));
    }, [refreshData]);

    const deleteBorrow = async (id: number) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/borrow?id=${id}`)
            if (res.data.status == 200) {
                alert('ลบข้อมูลสำเร็จ')
                ClearBorrowCache();
                GetBorrowWithCache().then((res) => setBorrow(
                    res.filter((v) => v.status == 4)
                        .sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
                ))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = borrow.slice(startIdx, endIdx);

    const totalPages = Math.ceil(borrow!.length / itemsPerPage);

    return (
        <Side>
            <Card className="w-full p-2">
                <CardHeader>
                    <h3 className="text-xl font-semibold">รายการที่ส่งคืนแล้ว</h3>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-800 ">
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center ">#</TableHead>
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่อโครงการ</TableHead>
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่อผู้ยืม</TableHead>
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center">วันที่ส่งคำขอ</TableHead>
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center">วันที่ส่งคืน</TableHead>
                                <TableHead className="text-stone-950 text-center">ดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <TableRow onClick={() => router.push(`/pages/admin/returnDetail/${item.id}`)} key={index} className="cursor-pointer border-b border-gray-300 ">
                                        <TableCell className="font-medium border-r border-gray-300 text-center">{index + 1}</TableCell>
                                        <TableCell className="border-r border-gray-300 text-start">{item.project}</TableCell>
                                        <TableCell className="border-r border-gray-300 text-start">{item.name + ' ' + item.lastname}</TableCell>
                                        <TableCell className="border-r border-gray-300 text-center">{item.createAt.split('T')[0]}</TableCell>
                                        <TableCell className="border-r border-gray-300 text-center">{item.retureAt.split('T')[0]}</TableCell>
                                        <TableCell className="text-center " onClick={(e) => e.stopPropagation()}>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant={'destructive'} className=" mb-2" onClick={(e) => e.stopPropagation()}>
                                                        <FaCircleMinus className="mr-2" /> ลบรายการนี้
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
                                                    <DialogHeader>
                                                        <DialogTitle>{`${item.name} `} ต้องการลบอุปกรณ์นี้จริงหรือไม่</DialogTitle>
                                                        <DialogDescription>
                                                            ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <div>
                                                            <DialogClose asChild>
                                                                <Button type="submit" className="bg-red-600 hover:bg-red-900 mr-2" onClick={(e) => { deleteBorrow(item.id); e.stopPropagation() }}>ยืนยัน</Button>
                                                            </DialogClose>
                                                            <DialogClose asChild>
                                                                <Button type="button" onClick={(e) => e.stopPropagation()}>ยกเลิก</Button>
                                                            </DialogClose>
                                                        </div>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center ">
                                        <p className="mt-5 text-2xl">
                                            ไม่พบข้อมูล
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )
                            }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-center items-center w-full">
                    {currentItems.length <= 0 ? null : PaginationComponent({ currentPage, totalPages, onPageChange: setCurrentPage })}
                </CardFooter>
            </Card>
        </Side>
    );
}