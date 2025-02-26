'use client'
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    // DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    // TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Equipment from '@/app/components/equipment/equipment'
import Profile from '@/app/components/profile/profile'
import DateComponent from '@/app/components/date/date'
import { ResOri, ResOriData } from '@/app/interfaces/ori'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { thsarabun } from '@/public/fonts/thsarabun'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas'
import { saveAs } from "file-saver";
interface ReqBorrowItem {
    setId?: number
    set?: Set
    itemName?: string
    value?: number
    division: string
}

export interface Set {
    Item_set: ItemSet[]
}

export interface ItemSet {
    itemName: string
    value: number
}

export default function Summary() {
    const [step, setStep] = useState(1);
    const [selectedItems, setSelectedItems] = useState<ReqBorrowItem[]>([]);
    const [personalData, setPersonalData] = useState<any>({});
    const [dates, setDates] = useState<any>({});
    const [ori, setOri] = useState<ResOriData[]>([]);
    const [set, setSet] = useState<any[]>([]);
    const router = useRouter();


    const getSet = async () => {
        try {
            const data = await axios.get(`/api/set`);
            if (data.status === 200) {
                setSet(data.data.data);
            } else {
                throw new Error(data.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const sendBorrow = async () => {
        try {
            const formData = new FormData();

            // เพิ่มข้อมูลส่วนบุคคล
            formData.append("lastname", personalData.lastname || "");
            formData.append("name", personalData.name || "");
            formData.append("mentor_name", personalData.mentor_name || "");
            formData.append("mentor_last", personalData.mentor_last || "");
            formData.append("project", dates.project || "");
            formData.append("participate", dates.participate || "");
            formData.append("tel", personalData.tel || "");
            formData.append("otherTel", personalData.otherTel || "");
            formData.append("serveAt", dates.serveAt || "");
            formData.append("type_borrow", personalData.type_borrow || "");
            formData.append("retureAt", dates.retureAt || "");
            formData.append("origanizationId", personalData.origanizationId || "");

            // เพิ่ม borrowDetails
            formData.append("borrowDetails", JSON.stringify(selectedItems));

            // เพิ่มไฟล์ (ตรวจสอบว่าไฟล์มีค่า)
            if (personalData.image instanceof File) {
                formData.append("image", personalData.image);
            }

            if (personalData.borrower_id instanceof File) {
                formData.append("borrower_id", personalData.borrower_id);
            }
            console.log("FormData content:");
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value instanceof File ? value.name : value);
            }
            const res = await axios.post(
                `/api/borrow`,
                formData, // ส่ง formData โดยตรง
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (res.status == 200) {
                console.log(res.data)
            }
        } catch (err) {
            console.error("err send borrow", err)
        }
    }

    // const exportToPDF = () => {
    //     const pdf = new jsPDF("p", "mm", "a4");

    //     // เพิ่มฟอนต์ภาษาไทย
    //     pdf.addFileToVFS("THSarabunNew.ttf", thsarabun);
    //     pdf.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
    //     pdf.setFont("THSarabunNew");

    //     pdf.setFontSize(16);
    //     pdf.text(`ใบสรุปรายการ ${dates.project}`, 10, 10);
    //     // pdf.text(`ผู้เข้าร่วมโดยประมาณ: ${dates.participate} คน`, 10, 30);

    //     pdf.setFontSize(12);
    //     pdf.text(`ชื่อ-นามสกุล: ${personalData.name} ${personalData.lastname}`, 10, 20);
    //     pdf.text(`เบอร์โทรศัพท์: ${personalData.tel}`, 10, 30);

    //     if (!selectedItems || selectedItems.length === 0) {
    //         console.error("ไม่มีข้อมูลรายการอุปกรณ์");
    //         return;
    //     }

    //     const tableData = selectedItems.flatMap((item, i) => {
    //         if ("set" in item && item.set?.Item_set) {
    //             // กรณีเป็นชุดของอุปกรณ์ (set)
    //             return item.set.Item_set.map((subItem) => [
    //                 String(i + 1),
    //                 String(subItem.itemName || "ไม่มีชื่อ"),
    //                 String(subItem.value || "0"),
    //                 String(item.division || "ไม่ระบุ"),
    //             ]);
    //         } else {
    //             // กรณีเป็นอุปกรณ์เดี่ยว
    //             return [[
    //                 String(i + 1),
    //                 String(item.itemName || "ไม่มีชื่อ"),
    //                 String(item.value || "0"),
    //                 String(item.division || "ไม่ระบุ"),
    //             ]];
    //         }
    //     });

    //     console.log('selectedItems---- >', selectedItems);
    //     console.log('tableData ------->', tableData);
    //     autoTable(pdf, {
    //         startY: 40,
    //         head: [["ลำดับ", "อุปกรณ์", "จำนวน", "จากฝ่าย"]],
    //         body: tableData,
    //         styles: { font: "THSarabunNew" } // บังคับใช้ฟอนต์
    //     });
    //     pdf.save(`Borrow_Detail_${dates.project}_${personalData?.name + ' ' + personalData?.lastname}.pdf`);
    // };

    const exportToPNG = async () => {
        const element = document.getElementById("export-area"); // ให้ div มี id="export-area"
    
        if (!element) {
            console.error("ไม่พบองค์ประกอบที่ต้องการแปลงเป็นรูปภาพ");
            return;
        }
    
        try {
            const canvas = await html2canvas(element, { scale: 2 }); // Scale 2 เพื่อความคมชัด
            const image = canvas.toDataURL("image/png"); // แปลงเป็น Base64
            saveAs(image, `Borrow_Detail_${dates.project}_${personalData?.name + ' ' + personalData?.lastname}.png`); // บันทึกเป็นไฟล์
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการสร้างภาพ PNG:", error);
        }
    };


    useEffect(() => {
        const fetchOri = async () => {
            try {
                const res = await axios.get<ResOri>('/api/Origanization');
                setOri(res.data.data);
            } catch (err) {
                console.error('err get ori --->', err);
            }
        }

        fetchOri();
        getSet();
    }, [])

    const handleItemSelect = (items: ReqBorrowItem[]) => {
        setSelectedItems(items);
        console.log('handleItemSelect --=-=-=-=-=-=-=-==-=>', items);
        setStep(2); // ไปยังขั้นตอนกรอกข้อมูลส่วนตัว
    };

    const handlePersonalInfo = (data: any) => {
        setPersonalData(data);
        setStep(3); // ไปยังขั้นตอนกรอกวันเวลา
    };

    const handleDateTimeSubmit = (data: any) => {
        setDates(data);
        // ส่งข้อมูลทั้งหมดที่ได้
        const finalData = {
            selectedItems,
            personalData,
            dates: dates,
        };
        setStep(4);
        console.log('finalData--=-=-=-=-=-=-=-==-=>', finalData); // ส่งข้อมูลทั้งหมดที่กรอก
    };
    return (
        <>
            {
                step == 1 && (
                    <Equipment onSelected={handleItemSelect} />
                )
            }
            {
                step == 2 && (
                    <Profile onBack={() => setStep(1)} onNext={handlePersonalInfo} />
                )
            }
            {
                step == 3 && (
                    <DateComponent onBack={() => setStep(2)} onNext={handleDateTimeSubmit} />
                )
            }
            {
                step == 4 && (
                    <div className='flex justify-center items-center h-100vh mt-8 mb-8'>
                        <Card className='w-[1000px] ml-2 mr-2 pl-0 pr-0'>
                            <span id='export-area'>
                                <CardHeader>
                                    <CardTitle className='text-xl'>ใบสรุปรายการ {dates.project}</CardTitle>
                                    <h3 className="text-xl font-semibold">จำนวนผู้เข้าร่วมโดยประมาณ: {dates?.participate} คน</h3>

                                </CardHeader>
                                <CardContent className='pl-2 pr-2'>
                                    <div className='mb-5'>
                                        {
                                            personalData.type_borrow == 'staff' ? (
                                                <ul>
                                                    <li><strong>สถานะ : </strong>{personalData.type_borrow}</li>
                                                    <li><strong>ชื่อ-นามสกุล : </strong>{personalData.name + ' ' + personalData.lastname}</li>
                                                    <li><strong>เบอร์โทรศัพท์มือถือ : </strong>{personalData.tel}</li>
                                                    <li><strong>เบอร์โทรสำนักงาน : </strong>{personalData.otherTel}</li>
                                                    <li><strong>คณะ/หน่วยงาน : </strong>{ori.find(ori => ori.id == personalData.origanizationId)?.name}</li>
                                                </ul>
                                            ) : (
                                                <ul>
                                                    <li><strong>สถานะ : </strong>{personalData.type_borrow}</li>
                                                    <li><strong>ชื่อ-นามสกุล : </strong>{personalData.name + ' ' + personalData.lastname}</li>
                                                    <li><strong>เบอร์โทรศัพท์มือถือ : </strong>{personalData.tel}</li>
                                                    <li><strong>ชื่อ-นามสกุล-อาจารย์ที่ปรึกษา : </strong>{personalData.mentor_name + ' ' + personalData.mentor_last}</li>
                                                    <li><strong>เบอร์โทร-อาจารย์ที่ปรึกษา : </strong>{personalData.otherTel}</li>
                                                    <li><strong>คณะ/หน่วยงาน : </strong>{ori.find(ori => ori.id == personalData.origanizationId)?.name}</li>
                                                </ul>
                                            )
                                        }
                                    </div>
                                    <Card className='w-full mb-5' >
                                        <CardHeader className='text-xl font-semibold m-0 p-3'>
                                            รายการวัสดุ - อุปกรณ์
                                        </CardHeader>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[5%] text-center">ลำดับ</TableHead>
                                                    <TableHead className="w-[45%] text-left">อุปกรณ์</TableHead>
                                                    <TableHead className="w-[10%] text-center">จำนวน</TableHead>
                                                    <TableHead className="w-[40%]text-left">จากฝ่าย</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedItems && (
                                                    selectedItems.map((v, i) => (
                                                        v.setId ? (
                                                            <>
                                                                {i === 0 || selectedItems[i - 1].setId !== v.setId ? (
                                                                    <TableRow key={`header-${v.setId}`}>
                                                                        <TableCell colSpan={5} className="font-medium text-center bg-gray-200">
                                                                            {set.find((v2) => v2.id === v.setId)?.name}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ) : null}
                                                                {
                                                                    v.set?.Item_set.map((v2, i2) => (
                                                                        <TableRow key={i}>
                                                                            <TableCell className="font-medium text-center">{i2 + 1}</TableCell>
                                                                            <TableCell className='text-left'>{v2.itemName}</TableCell>
                                                                            <TableCell className='text-center'>{v2.value}</TableCell>
                                                                            <TableCell className="text-left">{v.division}</TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                }
                                                            </>
                                                        ) : (
                                                            <>
                                                                {/* <TableRow key={i}>
                                                                <TableCell colSpan={4} className="font-medium text-center bg-gray-200">
                                                                    ไม่อยู่ในกลุ่มอุปกรณ์
                                                                </TableCell>
                                                            </TableRow> */}
                                                                <TableRow key={`no-set-${i}`}>
                                                                    <TableCell className="font-medium text-center">{i + 1}</TableCell>
                                                                    <TableCell className='text-left'>{v.itemName}</TableCell>
                                                                    <TableCell className='text-center'>{v.value}</TableCell>
                                                                    <TableCell className="text-left">{v.division}</TableCell>
                                                                </TableRow>
                                                            </>
                                                        )
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </CardContent>
                            </span>
                            <div className="mt-6 mb-6 flex justify-center space-x-4">
                                <button
                                    onClick={() => setStep(step - 1)}
                                    type="button"
                                    className="w-[100px] bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                                >
                                    ย้อนกลับ
                                </button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-[100px] bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200" onClick={(e) => e.stopPropagation()}>
                                            ยืนยัน
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
                                        <DialogHeader>
                                            <DialogTitle>ยืมเสร็จสิ้น</DialogTitle>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <div>
                                                <DialogClose asChild>
                                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-900 mr-2" onClick={() => { sendBorrow(); exportToPNG(); router.push('/'); }}>ยืนยัน</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>
                    </div>
                )
            }

        </>
    )
}

