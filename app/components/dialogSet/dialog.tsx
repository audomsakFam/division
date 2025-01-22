'use client';
import { ResItemsGroup } from "@/app/interfaces/item";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Set } from "@prisma/client";
import { FaCirclePlus } from "react-icons/fa6";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PaginationComponent from "../pagination/pagination";
import axios from "axios";
interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    resetForm: () => void;
    set: Set[];
    setSelect: string;
    setSetSelect: React.Dispatch<React.SetStateAction<string>>;
    items: ResItemsGroup[]
}

const DialogSetComponent = ({
    isOpen,
    setIsOpen,
    resetForm,
    set,
    setSelect,
    setSetSelect,
    items
}: Props) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filteredItems, setFilteredItems] = useState<ResItemsGroup[]>([]);
    const [nameFilter, setNameFilter] = useState('');
    const [divisionFilter, setDivisionFilter] = useState('');
    const [setId, setSetId] = useState(0);
    const [setItemName, setSetItemName] = useState<{ name: string }[]>([]);

    useEffect(() => {
        // Filter items based on the selected filters
        let filtered = items;


        if (nameFilter) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        if (divisionFilter) {
            filtered = filtered.filter(item =>
                item.divisionName.toLowerCase() === divisionFilter.toLowerCase()
            );

        }

        setCurrentPage(1);
        setFilteredItems(filtered);
    }, [nameFilter, divisionFilter, items]);

    useEffect(() => {
        if (setSelect === 'เลือกชุด') return
        setSetId(set.find((v) => v.name === setSelect)!.id);
    }, [setSelect])

    const addItemToSet = async (setId: number, itemName: { name: string }[]) => {
        try {
            const res = await axios.post(process.env.NEXT_PUBLIC_BASE_PATH + '/api/itemSet', { setId, itemName });
            if (res.status === 200) {
                alert("เพิ่มอุปกรณ์ลงในชุดสําเร็จ");
                setIsOpen(false);
                setSetItemName([]);
                setSetId(0);
                window.location.reload();
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์ลงในชุด");
            setIsOpen(false);
            setSetItemName([]);
            setSetId(0);
            console.log(error);
        }
    }

    const itemsPerPage = 20;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = filteredItems.slice(startIdx, endIdx);

    const totalPages = Math.ceil(filteredItems!.length / itemsPerPage);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                    resetForm();
                    setSetItemName([]);
                    setSetId(0);
                } // เคลียร์ข้อมูลเมื่อ dialog ถูกปิด
            }}
        >
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-900">
                    <FaCirclePlus className="mr-2" /> เพิ่มอุปกรณ์ลงในชุด
                </Button>
            </DialogTrigger>
            <DialogContent className="xl:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>ตรวจสอบอุปกรณ์</DialogTitle>
                    <DialogDescription>
                        โปรดตรวจสอบให้ละเอียดก่อนกดยืนยัน
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <h3 className="text-xl font-semibold">อุปกรณ์</h3>
                    <div className="flex justify-start items-start flex-grow h-full flex-col">
                        <div className="items-start justify-start flex flex-col gap-2 mb-2 w-full">
                            <Label htmlFor="set" className="text-left font-black">
                                เลือกชุดอุปกรณ์
                                {/* {setItemName.length > 0 ? `(${setItemName.join(', ')})` : ''} */}
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">{setSelect}</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 h-96 overflow-y-scroll">
                                    <DropdownMenuLabel>หน่วย</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup
                                        value={setSelect}
                                        onValueChange={setSetSelect}
                                    >
                                        {set.map((v, i) => (
                                            <DropdownMenuRadioItem key={i} value={v.name}>
                                                {v.name}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className=" items-center gap-2 mb-2 w-full">
                            <Label htmlFor="name" className={`text-left font-black ${setSelect === 'เลือกชุด' ? 'hidden' : ''}`}>
                                เลือกอุปกรณ์
                            </Label>
                            <Dialog>
                                <DialogTrigger asChild>

                                    <Button variant="outline" className={`w-full ${setSelect === 'เลือกชุด' ? 'hidden' : ''}`}>
                                        {items.length == 0 ? 'ไม่มีอุปกรณ์' : 'เลือกอุปกรณ์'}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="xl:max-w-2xl h-[80%] ">
                                    <Card className="h-full overflow-y-scroll">
                                        <CardHeader>
                                            <div className="flex gap-4 flex-wrap items-center ">
                                                <input
                                                    type="text"
                                                    placeholder="ค้นหาชื่ออุปกรณ์"
                                                    value={nameFilter}
                                                    onChange={(e) => setNameFilter(e.target.value)}
                                                    className="px-4 py-2 border rounded"
                                                />
                                                <select
                                                    value={divisionFilter}
                                                    onChange={(e) => setDivisionFilter(e.target.value)}
                                                    className="px-4 py-2 border rounded"
                                                >
                                                    <option value="">แผนก</option>
                                                    <option value="ฝ่ายพัฒนาศักยภาพนักศึกษา">ฝ่ายพัฒนาศักยภาพนักศึกษา</option>
                                                    <option value="ฝ่ายทำนุบำรุงศิลปวัฒนธรรม">ฝ่ายทำนุบำรุงศิลปวัฒนธรรม</option>
                                                    <option value="ฝ่ายสุขภาพและอนามัย">ฝ่ายสุขภาพและอนามัย</option>
                                                    <option value="ฝ่ายบริหารงานทั่วไป">ฝ่ายบริหารงานทั่วไป</option>
                                                    <option value="ฝ่ายแนะแนวการศึกษาอาชีพและศิษย์เก่า">ฝ่ายแนะแนวการศึกษาอาชีพและศิษย์เก่า</option>
                                                </select>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="h-[400px] overflow-y-scroll">
                                            <Table >
                                                <TableHeader>
                                                    <TableRow className="border-b border-gray-800 ">
                                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center ">#</TableHead>
                                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">ภาพประกอบ</TableHead>
                                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่ออุปกรณ์</TableHead>
                                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">หน่วย</TableHead>
                                                        <TableHead className="text-stone-950 border-r border-gray-300 text-center">ฝ่ายที่รับผิดชอบ</TableHead>
                                                        <TableHead className="text-stone-950 text-center">ดำเนินการ</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {currentItems.length > 0 ? (
                                                        currentItems.map((item, index) => (
                                                            <TableRow key={index} className="cursor-pointer border-b border-gray-300 ">
                                                                <TableCell className="font-medium border-r border-gray-300 text-center">{index + 1 + startIdx}</TableCell>
                                                                <TableCell className="border-r border-gray-300 text-center">
                                                                    <div className="group group-hover:relative overflow-hidden">
                                                                        {/* กล่องแสดงภาพหลัก */}
                                                                        <div className="flex  justify-center items-center overflow-hidden">
                                                                            <img
                                                                                src={process.env.NEXT_PUBLIC_BASE_PATH + '/' + item.img}
                                                                                width={90}
                                                                                height={90}
                                                                                alt="item image"
                                                                                className="transform  transition-all duration-300"
                                                                            />
                                                                        </div>

                                                                        {/* กล่องสำหรับแสดงภาพซูม */}
                                                                        <div className={`absolute w-1/5 hidden group-hover:flex justify-center items-center
                                                     right-1/2 transform z-100  -translate-x-[80%]
                                                    `}
                                                                        >
                                                                            <img
                                                                                src={process.env.NEXT_PUBLIC_BASE_PATH + '/' + item.img}
                                                                                alt="Zoomed image"
                                                                                className="transform w-full absolute"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="border-r border-gray-300 text-start">{item.name}</TableCell>
                                                                <TableCell className="border-r border-gray-300 text-center">{item.postfixName}</TableCell>
                                                                <TableCell className="border-r border-gray-300 text-center">{item.divisionName}</TableCell>
                                                                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                                                    {setItemName.some((v) => v.name === item.name) ? (
                                                                        <Button
                                                                            type="button"
                                                                            className="bg-red-600 hover:bg-red-900"
                                                                            onClick={(e) => {
                                                                                setSetItemName(setItemName.filter((v) => v.name !== item.name));
                                                                                e.stopPropagation();
                                                                            }}
                                                                        >
                                                                            ลบ
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            type="button"
                                                                            className="bg-green-600 hover:bg-green-900"
                                                                            onClick={(e) => {
                                                                                setSetItemName([...setItemName, { name: item.name }]);
                                                                                e.stopPropagation();
                                                                            }}
                                                                        >
                                                                            เพิ่ม
                                                                        </Button>
                                                                    )}
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
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                        <CardFooter>
                                            {currentItems.length > 0 && (
                                                <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                            )}
                                        </CardFooter>
                                    </Card>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" className="bg-green-600 hover:bg-green-900" onClick={(e) => e.stopPropagation()}>ตกลง</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {setItemName.length > 0 && (
                            <div className=" items-center gap-2 mb-2 w-full">
                                <Card className="h-full overflow-y-scroll">
                                    <CardHeader>
                                        <CardTitle>รายการอุปกรณ์ที่เลือก</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[300px] overflow-y-scroll">
                                        <Table >
                                            <TableHeader>
                                                <TableRow className="border-b border-gray-800 ">
                                                    <TableHead className="text-stone-950 border-r border-gray-300 text-center ">#</TableHead>
                                                    <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่ออุปกรณ์</TableHead>
                                                    <TableHead className="text-stone-950 text-center">ดำเนินการ</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {setItemName.length > 0 ? (
                                                    setItemName.map((item, index) => (
                                                        <TableRow key={index} className="cursor-pointer border-b border-gray-300 ">
                                                            <TableCell className="font-medium border-r border-gray-300 text-center">{index + 1 + startIdx}</TableCell>

                                                            <TableCell className="border-r border-gray-300 text-start">{item.name}</TableCell>
                                                            <TableCell className="border-r border-gray-300 text-center">
                                                                <Button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        setSetItemName(setItemName.filter((v) => v !== item));
                                                                        e.stopPropagation();
                                                                    }}
                                                                    className={`bg-red-600 hover:bg-red-900 ${setItemName.length > 0 ? '' : 'hidden'}`}
                                                                >
                                                                    ลบรายการนี้
                                                                </Button>
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
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            type="button"
                                            onClick={(e) => {
                                                setSetItemName([]);
                                                e.stopPropagation();
                                            }}
                                            className={`bg-red-600 hover:bg-red-900 ${setItemName.length > 0 ? '' : 'hidden'}`}
                                        >
                                            ลบรายการที่เลือกทั้งหมด
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            onClick={(e) => {
                                addItemToSet(setId, setItemName);
                                e.stopPropagation();
                            }}
                            className={`bg-blue-600 hover:bg-blue-900 ${setItemName.length > 0 ? '' : 'hidden'}`}
                        >
                            ยืนยัน
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DialogSetComponent;
