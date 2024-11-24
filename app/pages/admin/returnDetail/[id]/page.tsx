'use client';
import Side from "@/app/components/side/side";
import { ResBorrowData } from "@/app/interfaces/borrow";
import { GetBorrowWithCache } from "@/lib/servers/getItemWithCache";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import PaginationComponent from "@/app/components/pagination/pagination";

const itemsPerPage = 20;
export default function ReturnDetail({ params }: { params: { id: string } }) {
    const id = Number(decodeURIComponent(params.id));
    const [borrow, setBorrow] = useState<ResBorrowData>();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log('id--->', id);
        GetBorrowWithCache().then((res) => setBorrow(res.find((v) => v.id == id)!));
    }, [id])

    const currentItems = useMemo(() => {
        if (!borrow) return []; // รอ borrow พร้อมก่อน
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        return borrow.Borrow_detail.slice(startIdx, endIdx);
    }, [borrow, currentPage, itemsPerPage]); // อัปเดตเมื่อ borrow, currentPage, หรือ itemsPerPage เปลี่ยน

    // คำนวณ totalPages
    const totalPages = useMemo(() => {
        return borrow ? Math.ceil(borrow.Borrow_detail.length / itemsPerPage) : 0;
    }, [borrow, itemsPerPage]);

    // รอ borrow โหลดก่อนแสดงผล
    if (!borrow) {
        return <div>Loading...</div>;
    }
    return (
        <Side>
            <Card className="w-full p-2">
                <CardHeader >
                    <div className="flex justify-between p-4">
                        <div>
                            <h3 className="text-xl font-semibold">รายละเอียดการยืมของ {borrow?.project}</h3>
                            <h3 className="text-xl font-semibold">ผู้ยืม {borrow?.name + ' ' + borrow?.lastname}</h3>
                        </div>
                        <div>
                            {borrow.status != 4 ?
                                <h3 className="text-xl font-semibold">วันที่ยืม {borrow.createAt.split('T')[0]}</h3>
                                :
                                <h3 className="text-xl font-semibold">วันที่คืน {borrow.retureAt.split('T')[0]}</h3>
                            }
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-800 ">
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center ">#</TableHead>
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center ">ภาพประกอบ</TableHead>
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่ออุปกรณ์ / ชุดอุปกรณ์</TableHead>
                                {
                                    borrow.status != 4 ?
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">สถานะปัจจุบัน</TableHead>
                                        :
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">สถานะตอนคืน</TableHead>
                                }
                                <TableHead className="text-stone-950 text-center">ฝ่ายที่รับผิดชอบ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <TableRow key={index} className="border-b border-gray-300 ">
                                        <TableCell className="font-medium border-r border-gray-300 text-center">{index + 1}</TableCell>
                                        <TableCell className="font-medium border-r border-gray-300 text-center">
                                            <div className="group group-hover:relative overflow-hidden">
                                                {/* กล่องแสดงภาพหลัก */}
                                                <div className="flex  justify-center items-center overflow-hidden">
                                                    <img
                                                        src={item.item.img!}
                                                        width={90}
                                                        height={90}
                                                        alt="item image"
                                                        className="transform  transition-all duration-300"
                                                    />
                                                </div>

                                                {/* กล่องสำหรับแสดงภาพซูม */}
                                                <div className={`absolute w-1/5 hidden group-hover:flex justify-center items-center
                                                     right-1/2 transform z-100 
                                                    `}
                                                >
                                                    <img
                                                        src={item.item.img!}
                                                        alt="Zoomed image"
                                                        className="transform w-full absolute"
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="border-r border-gray-300 text-start">{item.item.name}</TableCell>
                                        <TableCell className="border-r border-gray-300 text-center">{
                                            borrow.status == 4 ? item.item_status: borrow.status == 1|| borrow.status == 0? 'รอการยืนยัน' : item.item.status  
                                        }</TableCell>
                                        <TableCell className="text-center ">
                                            {item.item.division.name}
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