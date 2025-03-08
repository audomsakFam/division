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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import { thsarabun } from "@/public/fonts/thsarabun";

// import * as XLSX from "xlsx";

const itemsPerPage = 200;
export default function ReturnDetail({ params }: { params: { id: string } }) {
    const id = Number(decodeURIComponent(params.id));
    const [borrow, setBorrow] = useState<ResBorrowData>();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log('id--->', id);
        GetBorrowWithCache().then((res) => {
            console.log('data borrow cache -> ', res);
            setBorrow(res.find((v) => v.id == id)!)
            console.log('borrow set --->', res.find((v) => v.id == id)!);
        });
    }, [id])
    const exportToPDF = async (scale: number = 4) => {
        const element = document.getElementById("pdf-content");
        console.log('wl--=-=-=->', element)
        if (element) {

            const canvas = await html2canvas(element, { scale });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            pdf.addFileToVFS("THSarabunNew.ttf", thsarabun);
            pdf.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
            pdf.setFont("THSarabunNew");

            // pdf.setFontSize(22);
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // เพิ่มภาพในหน้าแรก
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

            // ตรวจสอบว่า borrow มีค่าอยู่หรือไม่
            if (borrow) {
                // เพิ่มตารางด้วย autoTable
                autoTable(pdf, {
                    styles: { font: "THSarabunNew", fontSize: 18 },
                    head: [['#', 'ชื่ออุปกรณ์', 'จำนวน', 'สถานะปัจจุบัน', 'ฝ่ายที่รับผิดชอบ']],
                    body: currentItems.length > 0 ? currentItems.map((item, index) => [
                        index + 1,
                        item.item.name,
                        `${item.quantity} ${item.item.postfix.name}`,
                        borrow.status === 4 ? item.item_status :
                            borrow.status === 1 || borrow.status === 0 ? "รอการยืนยัน" : item.item.status,
                        item.item.division.name
                    ]) : [["ไม่มีข้อมูล", "", "", "", ""]],
                    startY: imgHeight + 10, // ตำแหน่งเริ่มต้นของตาราง
                    theme: 'striped', // ใช้ธีมแบบ striped
                    columnStyles: { 0: { halign: 'center' }, 1: { halign: 'left' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' } }, // ตั้งค่าการจัดเรียงในคอลัมน์
                });
            } else {
                console.warn("borrow is undefined.");
            }

            // ดาวน์โหลดไฟล์ PDF
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

    if (!borrow) {
        return <div>Loading...</div>;
    }
    return (
        <Side>
            <>
                <Card className="w-full p-2">
                    <span>
                        <CardHeader id="pdf-content">
                            <div className="flex justify-between p-4">
                                <div>
                                    <h3 className="text-xl font-semibold">รายละเอียดการยืมของ: {borrow?.project}</h3>
                                    <h3 className="text-xl font-semibold">จำนวนผู้เข้าร่วมโดยประมาณ: {borrow?.participate} คน</h3>
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-semibold mr-2">ผู้ยืม: {borrow?.name + ' ' + borrow?.lastname}</h3>
                                        <h3 className="text-xl font-semibold">องค์กร: {borrow?.origanization.name}</h3>
                                    </div>
                                    {borrow.mentor_name != '-' && (
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">ที่ปรึกษา: {borrow?.mentor_name + ' ' + borrow?.mentor_last}</h3>
                                            <div className="flex">
                                                <div className="group group-hover:relative overflow-hidden mb-4 mr-4">
                                                    {/* กล่องแสดงภาพหลัก */}
                                                    <div className="flex justify-start items-center overflow-hidden">
                                                        <img
                                                            src={'http://172.20.48.135:9000/images' + '/sign/' + borrow.img_sign}
                                                            crossOrigin="anonymous"
                                                            width={200}
                                                            height={200}
                                                            alt="item image"
                                                            className="transform transition-all duration-300"
                                                        />
                                                    </div>
                                                    {/* กล่องสำหรับแสดงภาพซูม */}
                                                    <div className={`absolute w-1/2 hidden group-hover:flex justify-center items-center transform z-1000`}>
                                                        <img
                                                            src={'http://172.20.48.135:9000/images' + '/sign/' + borrow.img_sign}
                                                            crossOrigin="anonymous"
                                                            alt="Zoomed image"
                                                            className="transform w-full absolute w-[400px] "
                                                        />
                                                    </div>
                                                </div>
                                                <div className="group group-hover:relative overflow-hidden mb-4">
                                                    {/* กล่องแสดงภาพหลัก */}
                                                    <div className="flex justify-start items-center overflow-hidden">
                                                        <img
                                                            src={'http://172.20.48.135:9000/images' + '/sign/' + borrow.borrower_id}
                                                            crossOrigin="anonymous"
                                                            width={200}
                                                            height={200}
                                                            alt="item image"
                                                            className="transform transition-all duration-300"
                                                        />
                                                    </div>
                                                    {/* กล่องสำหรับแสดงภาพซูม */}
                                                    <div className={`absolute w-1/2  hidden group-hover:flex justify-center items-center transform z-1000`}>
                                                        <img
                                                            src={'http://172.20.48.135:9000/images' + '/sign/' + borrow.borrower_id}
                                                            alt="Zoomed image"
                                                            className="transform w-full absolute w-[400px] "
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {borrow.status != 4 ?
                                        <h3 className="text-xl font-semibold">วันที่ยืม {borrow.createAt.split('T')[0]}</h3>
                                        :
                                        <>
                                            <h3 className="text-xl font-semibold">วันที่ยืม {borrow.createAt.split('T')[0]}</h3>
                                            <h3 className="text-xl font-semibold">วันที่คืน {borrow.retureAt.split('T')[0]}</h3>
                                        </>
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
                                                            {item.set ? "อุปกรณ์ยืมชุด *" + item.set.name : "อุปกรณ์ยืมเดียว"}
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
                                                                    src={'http://172.20.48.135:9000/images' + '/items/'  + item.item.img!}
                                                                    width={90}
                                                                    height={90}
                                                                    alt="item image"
                                                                    className="transform transition-all duration-300"
                                                                    crossOrigin="anonymous"
                                                                />
                                                            </div>
                                                            {/* กล่องสำหรับแสดงภาพซูม */}
                                                            <div className={`absolute w-1/5 hidden group-hover:flex justify-center items-center right-1/2 transform z-100`}>
                                                                <img
                                                                    src={'http://172.20.48.135:9000/images' + '/items/' + item.item.img!}
                                                                    alt="Zoomed image"
                                                                    className="transform w-full absolute"
                                                                    crossOrigin="anonymous"
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
                            {/* {PaginationComponent({ currentPage, totalPages, onPageChange: setCurrentPage })} */}
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