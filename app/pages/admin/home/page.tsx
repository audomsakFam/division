'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Side from "@/app/components/side/side";
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ClearBorrowCache, ClearItemCache, GetBorrowWithCache, GetItemWithCache } from '@/lib/servers/getItemWithCache';
import { ResBorrowData } from '@/app/interfaces/borrow';
import { FaChartSimple } from 'react-icons/fa6';
import PaginationComponent from '@/app/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { useRefresh } from '@/app/context/refreshProvider';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const itemsPerPage = 10;
export default function HomePage() {
    const [chartConfigs, setChartConfigs] = useState<any[]>([]);
    const [borrow, setBorrow] = useState<ResBorrowData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { refreshData, setRefreshData } = useRefresh();
    const [statusTosave, setStatusTosave] = useState<{ id: number; status: string, isChecked?: boolean }[]>([]);
    const router = useRouter();

    const handleStatusChange = (id: number, value: string, isChecked: boolean) => {
        setStatusTosave((prevStatusTosave) =>
            prevStatusTosave.length === 0
                ? [...prevStatusTosave, { id, status: value, isChecked }]
                : [
                    ...prevStatusTosave.filter((v) => v.id !== id), // กรองออกเฉพาะรายการเดิมที่มี id ตรงกัน
                    { id, status: value, isChecked }, // เพิ่มหรืออัปเดตรายการใหม่
                ]
        );
    };

    const deleteBorrow = async (id: number) => {
        try {
            await axios.delete(`/api/borrow/${id}`);
            setRefreshData(true);
        } catch (err) {
            console.error(err);
        }
    }

    const toOpen = async (id: number): Promise<{ id: number }[]> => {
        setStatusTosave((prevStatusTosave) => [...prevStatusTosave, { id, status: 'ปกติ', isChecked: true }]);
        return statusTosave
    };
    const toUpdate = async (borrowId: number, items: { id: number; status: string }[]) => {
        await axios.post('/api/borrow/update', { id: borrowId, itemUpdates: items })
            .then((res) => {
                console.log('test res--->', res)
                setRefreshData(true)
            }
            ).catch((err) => console.error(err))
    }

    useEffect(() => {
        if (refreshData) {
            ClearBorrowCache();
            ClearItemCache();
            console.log('working , refreshData ====>>>>', refreshData);
            GetItemWithCache();
            GetBorrowWithCache().then((res) => setBorrow(
                res.filter((v) => v.status != 4)
                    .sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
            ));
            setRefreshData(false);  // รีเซ็ตค่า refreshData
        }
        const newChartConfigs = [
            {
                type: 'area',
                options: {
                    chart: {
                        id: 'area-chart',
                        // toolbar: {
                        //     show: false, // ซ่อนปุ่มเครื่องมือ
                        // },
                    },
                    // title: {
                    //     text: 'Area Chart',
                    //     align: 'center',
                    // },
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // หมวดหมู่ของกราฟ
                    },
                    yaxis: {
                        min: 0, // กำหนดค่าต่ำสุดของแกน Y
                        max: 100, // กำหนดค่าสูงสุดของแกน Y
                    },
                    fill: {
                        type: 'gradient', // ใช้ gradient เพื่อสร้างพื้นที่ที่มีสี
                        gradient: {
                            shade: 'light', // สีของพื้นที่
                            type: 'horizontal', // ทิศทางของ gradient
                            shadeIntensity: 0.3,
                            gradientToColors: ['#F2F4F7'], // สีที่ไปถึงจาก gradient
                            opacityFrom: 0.7,
                            opacityTo: 0.3,
                            stops: [0, 100], // การเปลี่ยนแปลงสีตามที่กำหนด
                        }
                    },
                    stroke: {
                        curve: 'smooth', // ทำให้เส้นกราฟเรียบ
                    }
                },
                series: [
                    {
                        name: 'สาขา1',
                        data: [10, 20, 30, 40, 50, 60], // ข้อมูลชุดที่ 1
                    },
                    {
                        name: 'สาขา2',
                        data: [5, 15, 25, 35, 45, 55], // ข้อมูลชุดที่ 2
                    },
                    {
                        name: 'สาขา3',
                        data: [6, 12, 18, 24, 30, 36], // ข้อมูลชุดที่ 3
                    },
                    {
                        name: 'สาขา4',
                        data: [7, 14, 21, 28, 35, 42], // ข้อมูลชุดที่ 4
                    },
                    {
                        name: 'สาขา5',
                        data: [9, 18, 27, 36, 45, 54], // ข้อมูลชุดที่ 5
                    },
                ],
                title: 'ความถี่ของการยืม', // แยก title ออกมา
            },
            {
                type: 'bar',
                options: {
                    chart: { id: 'bar' },
                    xaxis: { categories: ['ส1', 'ส2', 'ส3', 'ส4', 'ส5'] },
                    plotOptions: {
                        bar: {
                            distributed: false
                        }
                    },
                    colors: ['#7febd6', '#69e3cb', '#5ae5c9', '#4ce1c4', '#38debd', '#28dab7', '#0fd9b1'], //'#b2fff0', '#a2f8e7', '#92eedc',
                },
                series: [
                    {
                        name: 'Data 1',
                        data: [20, 30, 40, 50, 60],
                    },
                    {
                        name: 'Data 2',
                        data: [30, 40, 50, 60, 70],
                    },
                    {
                        name: 'Data 3',
                        data: [15, 25, 35, 45, 55],
                    },
                    {
                        name: 'Data 4',
                        data: [10, 24, 37, 48, 45],
                    },
                    {
                        name: 'Data 5',
                        data: [98, 88, 78, 68, 58],
                    },
                    {
                        name: 'Data 6',
                        data: [76, 66, 56, 46, 36],
                    },
                    {
                        name: 'Data 7',
                        data: [11, 21, 31, 41, 51],
                    },
                    // {
                    //     name: 'Data 8',
                    //     data: [52, 42, 32, 22, 12],
                    // },
                    // {
                    //     name: 'Data 9',
                    //     data: [11, 22, 33, 44, 55],
                    // },
                    // {
                    //     name: 'Data 10',
                    //     data: [55, 66, 77, 88, 99],
                    // },
                ],
                title: 'ความสัมพันธ์ของการยืม/หน่วยงาน', // แยก title ออกมา
            },
        ];
        setChartConfigs(newChartConfigs);
        GetBorrowWithCache().then((res) => setBorrow(
            res.filter((v) => v.status != 4)
                .sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
        ));
    }, [refreshData]);

    const updateStatus = async (id: number) => {
        await axios.put(`/api/borrow/update`, { id })
            .then(() => {
                ClearBorrowCache();
                setRefreshData(true);
            }).catch((err) => {
                console.error(err);
            })
    }

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = borrow.slice(startIdx, endIdx);

    const totalPages = Math.ceil(borrow!.length / itemsPerPage);

    return (
        <Side>
            <Tabs defaultValue="borrow" className="w-full ">
                <div className='flex justify-center'>
                    <TabsList className="grid grid-cols-1 w-full h-full md:w-1/2 md:grid-cols-2 bg-blue-950 sm:grid-cols-1 sm:w-full sm:h-full">
                        <TabsTrigger value="borrow" className='sm:w-full sm:mt-2 md:mt-0'>คำขอการยืม
                            {Array.isArray(borrow) && borrow.filter((v) => v.status == 1 || v.status == 0 || v.status == 2 || v.status == 3).length > 0 ?
                                <span className='flex'>
                                    <div className='text-slate-100 rounded-full bg-red-500 w-5 h-5 flex justify-center items-center ml-2 mr-2'>
                                        {borrow.filter((v) => v.status == 1 || v.status == 0).length}
                                    </div>
                                    <div className='text-slate-100 rounded-full bg-yellow-500 w-5 h-5 flex justify-center items-center mr-2'>
                                        {borrow.filter((v) => v.status == 2).length}
                                    </div>
                                    <div className='text-slate-100 rounded-full bg-green-500 w-5 h-5 flex justify-center items-center '>
                                        {borrow.filter((v) => v.status == 3).length}
                                    </div>
                                </span>

                                : ''}
                        </TabsTrigger>
                        <TabsTrigger value="home" className='sm:w-full'>กราฟสรุปผล <FaChartSimple className='ml-2' /></TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="home">
                    <div className="flex flex-col w-full">
                        {chartConfigs && chartConfigs.map((config, index) => (
                            <Card key={index} className="w-full mb-2">
                                <CardHeader>
                                    <h3 className="text-xl font-semibold">{config.title}</h3>
                                </CardHeader>
                                <CardContent>
                                    <Chart
                                        options={config.options}
                                        series={config.series}
                                        type={config.type}
                                        width="100%"
                                        height="600"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="borrow">
                    <Card className="w-full p-2">
                        <CardHeader>
                            <h3 className="text-xl font-semibold">รายการคำขอ</h3>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-gray-800 ">
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center ">#</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่อโครงการ</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่อผู้ยืม</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">สถานะ</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">วันที่ส่งคำขอ</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">วันที่ส่งมอบ</TableHead>
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
                                                <TableCell className="border-r border-gray-300 text-start">{
                                                    item.status == 0 ? 'กำลังประมวลผล' : item.status == 1 ? 'รอการยืนยัน' :
                                                        item.status == 2 ? 'รอส่งมอบ' :
                                                            item.status == 3 ? 'รอส่งคืน' :
                                                                ''
                                                }</TableCell>
                                                <TableCell className="border-r border-gray-300 text-center">{item.createAt.split('T')[0]}</TableCell>
                                                <TableCell className="border-r border-gray-300 text-center">{item.serveAt.split('T')[0]}</TableCell>
                                                {
                                                    item.status != 3 ?
                                                        <TableCell className="text-center ">
                                                            <Button className={`${item.status == 1 ? 'bg-red-500' :
                                                                item.status == 2 ? 'bg-yellow-500' : 'bg-blue-900'
                                                                }`}

                                                                onClick={(e) => { e.stopPropagation(); updateStatus(item.id); }}>
                                                                {
                                                                    item.status == 1 ? 'ยืนยัน' :
                                                                        item.status == 2 ? 'ยืนยันการส่งมอบ' :
                                                                            ''
                                                                }
                                                            </Button>

                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        className="ml-2"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                        }}
                                                                    >
                                                                        ยกเลิก
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent  onClick={(e) => { e.stopPropagation(); }}  className="sm:max-w-md">
                                                                    <DialogHeader>
                                                                        <DialogTitle>ยกเลิกคำขอ</DialogTitle>
                                                                        <DialogDescription>
                                                                            การลบข้อมูลนี้ไม่สามารถกู้คืนได้
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <DialogClose asChild>
                                                                            <Button type="button" onClick={(e) => { e.stopPropagation(); deleteBorrow(item.id) }} className='bg-blue-900'>ยืนยัน</Button>
                                                                        </DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TableCell>
                                                        :
                                                        <TableCell className="text-center ">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        className="bg-green-500"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            const ids = item.Borrow_detail.map((v) => v.itemId || v.set.id); // ดึง id ทั้งหมดใน Borrow_detail
                                                                            ids.forEach((id) => toOpen(id)); // เรียกใช้ toOpen สำหรับแต่ละ id
                                                                        }}
                                                                    >
                                                                        ยืนยันการส่งคืน
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent  onClick={(e) => { e.stopPropagation(); }}  className="xl:max-w-2xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>ตรวจสอบอุปกรณ์</DialogTitle>
                                                                        <DialogDescription>
                                                                            โปรดตรวจสอบอุปกรณ์ให้ละเอียดก่อนกดยืนยัน
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="grid gap-4 py-4 ">
                                                                        <div className="grid grid-cols-2 items-center gap-2 mb-2">
                                                                            <Label htmlFor="project" className="text-left font-black">
                                                                                ชื่อโครงการ
                                                                            </Label>
                                                                            <Input
                                                                                id="project"
                                                                                readOnly
                                                                                defaultValue={item.project}
                                                                                className="text-stone-950 col-span-3 pointer-events-none border-0 bg-transparent"
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-2 items-center gap-2 mb-2">
                                                                            <Label htmlFor="username" className="text-left font-black">
                                                                                ชื่อผู้ยืม
                                                                            </Label>
                                                                            <Input
                                                                                id="username"
                                                                                readOnly
                                                                                defaultValue={item.name + ' ' + item.lastname}
                                                                                className="text-stone-950 col-span-3 pointer-events-none border-0 bg-transparent"
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col mb-2">
                                                                            <Label htmlFor="items" className="text-left font-black">
                                                                                อุปกรณ์ที่ยืม
                                                                            </Label>
                                                                            {item.Borrow_detail &&
                                                                                item.Borrow_detail.map((v) => (
                                                                                    <span key={v.item.id} className="flex items-center gap-4">
                                                                                        <Input
                                                                                            id="items"
                                                                                            defaultValue={v.item.name}
                                                                                            className="text-stone-950 w-1/2 pointer-events-none border-0 bg-transparent"
                                                                                        />
                                                                                        <div className="flex items-center gap-2">
                                                                                            <label className="flex items-center gap-1">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`status-${v.item.id}`}
                                                                                                    value="ปกติ"
                                                                                                    checked={statusTosave.some((v2) => v2.id === v.item.id && v2.status === "ปกติ")}
                                                                                                    onChange={(e) => handleStatusChange(v.item.id, "ปกติ", e.target.checked)}
                                                                                                    className="cursor-pointer"
                                                                                                />
                                                                                                ปกติ
                                                                                            </label>
                                                                                            <label className="flex items-center gap-1">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`status-${v.item.id}`}
                                                                                                    value="ชำรุด"
                                                                                                    checked={statusTosave.some((v2) => v2.id === v.item.id && v2.status === "ชำรุด")}
                                                                                                    onChange={(e) => handleStatusChange(v.item.id, "ชำรุด", e.target.checked)}
                                                                                                    className="cursor-pointer"
                                                                                                />
                                                                                                ชำรุด
                                                                                            </label>
                                                                                            <label className="flex items-center gap-1">
                                                                                                <input
                                                                                                    type="radio"
                                                                                                    name={`status-${v.item.id}`}
                                                                                                    value="หาย"
                                                                                                    checked={statusTosave.some((v2) => v2.id === v.item.id && v2.status === "หาย")}
                                                                                                    onChange={(e) => handleStatusChange(v.item.id, "หาย", e.target.checked)}
                                                                                                    className="cursor-pointer"
                                                                                                />
                                                                                                หาย
                                                                                            </label>
                                                                                        </div>
                                                                                    </span>
                                                                                ))}
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <DialogClose asChild>
                                                                            <Button type="button" onClick={(e) => { e.stopPropagation(); toUpdate(item.id, statusTosave) }} className='bg-blue-900'>ยืนยัน</Button>
                                                                        </DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TableCell>
                                                }
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
                </TabsContent>
            </Tabs>

        </Side>
    );
}

// {
//     type: 'pie',
//     options: {
//         chart: { id: 'pie' },
//         labels: ['A', 'B', 'C', 'D'],
//     },
//     series: [44, 55, 13, 43],
//     title: 'Pie Chart', // แยก title ออกมา
// },
// {
//     type: 'donut',
//     options: {
//         chart: { id: 'donut' },
//         labels: ['Red', 'Blue', 'Green'],
//     },
//     series: [30, 40, 30],
//     title: 'Donut Chart', // แยก title ออกมา
// }