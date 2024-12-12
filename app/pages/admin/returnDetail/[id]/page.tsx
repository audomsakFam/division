'use client';
import Side from "@/app/components/side/side";
import { BorrowDetail, ResBorrowData } from "@/app/interfaces/borrow";
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// import * as XLSX from "xlsx";

const itemsPerPage = 20;
export default function ReturnDetail({ params }: { params: { id: string } }) {
    const id = Number(decodeURIComponent(params.id));
    const [borrow, setBorrow] = useState<ResBorrowData>();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log('id--->', id);
        GetBorrowWithCache().then((res) => setBorrow(res.find((v) => v.id == id)!));
    }, [id])

    // const exportToExcel = (data: BorrowDetail[]) => {
    //     const worksheetData = data?.map((item) => {
    //         return {
    //             "ชื่ออุปกรณ์ / ชุดอุปกรณ์": item.item.name,
    //             "จำนวน": item.quantity + " " + item.item.postfix.name,
    //             "สถานะ": item.item.status,
    //             "ฝ่ายที่รับผิดชอบ": item.item.division.name,
    //         };
    //     });
    //     // สร้าง Worksheet
    //     const ws = XLSX.utils.json_to_sheet(worksheetData);
    //     // สร้าง Workbook
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Borrow Detail");
    //     // ดาวน์โหลดไฟล์ Excel
    //     XLSX.writeFile(wb, `Borrow_Detail_${borrow?.project}_${borrow?.name + ' ' + borrow?.lastname}.xlsx`);
    // };
    const exportToPDF = async (scale: number = 4) => {
        const element = document.getElementById("pdf-content");
        if (element) {
            // ใช้ html2canvas พร้อมกับตัวเลือก scale
            const canvas = await html2canvas(element, { scale });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Borrow_Detail_${borrow?.project}_${borrow?.name + ' ' + borrow?.lastname}.pdf`);
        }
    };



    const currentItems = useMemo(() => {
        if (!borrow) return []; // รอ borrow พร้อมก่อน

        const mergedItems = borrow.Borrow_detail.reduce((acc, item) => {
            const existingItem = acc.find((i) => i.item.name === item.item.name && i.item.status === item.item.status);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + (item.quantity || 1); // ค่าเริ่มต้นเป็น 1
            } else {
                acc.push({ ...item, quantity: item.quantity || 1 }); // ค่าเริ่มต้นเป็น 1
            }
            return acc;
        }, [] as (BorrowDetail & { quantity: number })[]);

        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        return mergedItems.slice(startIdx, endIdx);
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
            <>
                <Card className="w-full p-2">
                    <span id="pdf-content">
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
                                    <TableRow className="border-b border-gray-800">
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">#</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">ภาพประกอบ</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่ออุปกรณ์ / ชุดอุปกรณ์</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">จำนวน</TableHead>
                                        {borrow.status !== 4 ? (
                                            <TableHead className="text-stone-950 border-r border-gray-300 text-center">สถานะปัจจุบัน</TableHead>
                                        ) : (
                                            <TableHead className="text-stone-950 border-r border-gray-300 text-center">สถานะตอนคืน</TableHead>
                                        )}
                                        <TableHead className="text-stone-950 text-center">ฝ่ายที่รับผิดชอบ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.length > 0 ? (
                                        currentItems.reduce<JSX.Element[]>((acc, item, index) => {
                                            // ตรวจสอบการจัดกลุ่มตาม setId
                                            if (index === 0 || item.setId !== currentItems[index - 1]?.setId) {
                                                // ถ้าเป็นชุดใหม่ หรือไม่มีกลุ่มชุด ให้เพิ่มแถวแยกแสดงชื่อชุดอุปกรณ์
                                                acc.push(
                                                    <TableRow key={`set-${item.id}`} className="border-b">
                                                        <TableCell colSpan={6} className="font-bold text-center bg-gray-200">
                                                            {item.set?.name || "ไม่อยู่ในชุดอุปกรณ์"}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            // เพิ่มข้อมูลในกลุ่ม
                                            acc.push(
                                                <TableRow key={item.id} className="border-b">
                                                    <TableCell className="border-r border-gray-300 text-center">
                                                        {index + 1} {/* ใช้ acc.length เป็นลำดับ */}
                                                    </TableCell>
                                                    <TableCell className="border-r border-gray-300 text-center">
                                                        <div className="group group-hover:relative overflow-hidden">
                                                            {/* กล่องแสดงภาพหลัก */}
                                                            <div className="flex justify-center items-center overflow-hidden">
                                                                <img
                                                                    src={process.env.NEXT_PUBLIC_BASE_PATH + "/" + item.item.img!}
                                                                    width={90}
                                                                    height={90}
                                                                    alt="item image"
                                                                    className="transform transition-all duration-300"
                                                                />
                                                            </div>
                                                            {/* กล่องสำหรับแสดงภาพซูม */}
                                                            <div className={`absolute w-1/5 hidden group-hover:flex justify-center items-center right-1/2 transform z-100`}>
                                                                <img
                                                                    src={process.env.NEXT_PUBLIC_BASE_PATH + "/" + item.item.img!}
                                                                    alt="Zoomed image"
                                                                    className="transform w-full absolute"
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="border-r border-gray-300 text-center">{item.item.name}</TableCell>
                                                    <TableCell className="border-r border-gray-300 text-center">
                                                        {item.quantity + " " + item.item.postfix.name}
                                                    </TableCell>
                                                    <TableCell className="border-r border-gray-300 text-center">
                                                        {borrow.status === 4
                                                            ? item.item_status
                                                            : borrow.status === 1 || borrow.status === 0
                                                                ? "รอการยืนยัน"
                                                                : item.item.status}
                                                    </TableCell>
                                                    <TableCell className="text-center">{item.item.division.name}</TableCell>
                                                </TableRow>
                                            );
                                            return acc;
                                        }, [])
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">ไม่พบข้อมูล</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </span>
                    <CardFooter className="flex justify-center items-center w-full">
                        {currentItems.length <= 0 ? null : <>
                            {PaginationComponent({ currentPage, totalPages, onPageChange: setCurrentPage })}
                            {borrow.status == 4 && (
                                <>
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => exportToPDF(4)}>Export to PDF</button>
                                    {/* <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => exportToExcel(currentItems)}>Export to Excel</button> */}
                                </>
                            )}
                        </>}
                    </CardFooter>
                </Card>
            </>
        </Side>
    );
}