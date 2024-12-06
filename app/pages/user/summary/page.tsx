'use client'
import React from 'react'
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    // TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link'


export default function Summary() {
    return (
        <>
            <div className='flex justify-center items-center h-100vh mt-8 mb-8'>
                <Card className='w-[1000px] ml-2 mr-2 pl-0 pr-0'>
                    <CardHeader>
                        <CardTitle className='text-xl'>ใบสรุปรายการ</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2 pr-2'>
                        <div className='mb-5'>
                            <ul>
                                <li><strong>สถานะ : </strong>บุคลากร</li>
                                <li><strong>ชื่อ-นามสกุล : </strong>สมชาย ใจดี</li>
                                <li><strong>เบอร์โทรศัพท์มือถือ : </strong>098-123456</li>
                                <li><strong>เบอร์โทรสำนักงาน : </strong>02-123456</li>
                                <li><strong>คณะ/หน่วยงาน : </strong>กองพัฒนานักศึกษา</li>
                            </ul>
                        </div>
                        <Card className='w-full mb-5'>
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
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-center">1</TableCell>
                                        <TableCell className='text-left'>คอมพิวเตอร์</TableCell>
                                        <TableCell className='text-center'>5</TableCell>
                                        <TableCell className="text-left">ฝ่ายบริหารงานทั่วไป</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>
                        <div className='mt-10'>
                            <ul>
                                <li><strong>วันที่ยืมวัสดุ - อุปกรณ์ : </strong> 5/12/2567</li>
                                <li><strong>วันและเวลาทีเข้ารับวัสดุ - อุปกรณ์ : </strong>7/12/2567-13:00 น.</li>
                                <li><strong>วันที่คืนวัสดุ - อุปกรณ์ : </strong> 10/12/2567</li>
                                <li><strong>โครงการ/กิจกรรม : </strong>กิจกรรมสัมมนา</li>
                            </ul>
                        </div>
                    </CardContent>
                    <div className="mt-6 mb-6 flex justify-center space-x-4">
                        <Link href="/pages/user/date">
                            <button
                                type="button"
                                className="w-[100px] bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                            >
                                ย้อนกลับ
                            </button>
                        </Link>
                        <Link href="#">
                            <button
                                type="button"
                                className="w-[100px] bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                ยืนยัน
                            </button>
                        </Link>
                    </div>
                </Card>

            </div>
        </>
    )
}