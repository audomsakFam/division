'use client';

import Side from "@/app/components/side/side";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ResItemDetial, resItemDetialData } from "@/app/interfaces/item";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import PaginationComponent from "@/app/components/pagination/pagination";
import { Button } from "@/components/ui/button";
import { ResDivision, ResDivisionData } from "@/app/interfaces/division";
import { ClearItemCache } from "@/lib/servers/getItemWithCache";
import { FaCircleMinus, FaCirclePlus, FaPen } from "react-icons/fa6";
import { PostfixData, ResPostfix } from "@/app/interfaces/postfix";

// const itemsPerPage = 10;
export default function ItemDetail({ params }: { params: { name: string } }) {
    const [items, setItems] = useState<resItemDetialData[]>([]);
    const [itemsNum, setItemsNum] = useState<Record<'normal' | 'borrowed' | 'damaged' | 'lost', number>>({
        normal: 0, // จำนวนเริ่มต้นสำหรับ "ปกติ"
        borrowed: 0, // "ถูกยืม"
        damaged: 0, // "ชำรุด"
        lost: 0, // "หาย"
    });
    const [itemDetail, setItemDetail] = useState<resItemDetialData>();
    // const [currentPage, setCurrentPage] = useState(1);
    // const [filteredItems, setFilteredItems] = useState<resItemDetialData[]>([]);
    // const [statusFilter, setStatusFilter] = useState('');
    const name = decodeURIComponent(params.name)
    const [newName, setNewName] = useState(name)
    const [postfix, setPostfix] = useState<PostfixData[]>([]);
    const [postfixSelect, setPostfixSelect] = useState('')
    const [clone, setClone] = useState(0)
    const [position, setPosition] = React.useState('')
    const [division, setDivision] = useState<ResDivisionData[]>([]);

    const totalItems = itemsNum.normal + itemsNum.borrowed + itemsNum.damaged + itemsNum.lost;

    const cloneItem = async (itemId: number, cloneCount: number) => {
        try {
            const res = await axios.post('/api/items', { itemId, cloneCount });
            console.log(res);
            ClearItemCache()
            window.location.reload();
        } catch (err) {
            console.error(err)
        }
    }

    const getPostfix = async () => {
        await axios.get<ResPostfix>('/api/postfix')
            .then((res) => {
                setPostfix(res.data.data);
            }).catch((err) => console.error(err))
    }

    const deleteItem = async (name: string, deleteCount: number) => {
        try {
            const res = await axios.delete(`/api/items?name=${name}&count=${deleteCount}`);
            console.log(res);
            ClearItemCache()
            window.location.reload();
        } catch (err) {
            console.error(err)
        }
    }

    const updateAll = async () => {
        try {
            const res = await axios.post('/api/items/update', { name: name, newName: newName, division: position, status: itemsNum, postfix: postfixSelect });
            if (res.status === 200) {
                const currentUrl = new URL(window.location.href);
                currentUrl.pathname = `${currentUrl.pathname.replace(params.name, '')}/${newName}`;
                window.history.pushState({}, '', currentUrl.toString());
                ClearItemCache()
                window.location.reload();
            };
            console.log(res);
        } catch (e) {
            console.error(e)
        }
    }

    const handleChange = (field: keyof typeof itemsNum, value: number) => {
        if (value < 0) return;
        const remaining = totalItems - value; // คำนวณคงเหลือที่ต้องกระจาย
        console.log('remaining', remaining)
        if (remaining < 0) return;
        if (field === "normal") {
            setItemsNum((prev) => ({
                ...prev,
                normal: value,
                borrowed: Math.min(prev.borrowed, remaining),
                damaged: Math.min(prev.damaged, remaining),
                lost: Math.min(prev.lost, remaining),
            }));
        } else {
            setItemsNum((prev) => {
                const newNormal = totalItems - value - prev.borrowed - prev.damaged - prev.lost + prev[field];
                if (newNormal < 0) return prev; // ป้องกันค่าปกติติดลบ
                return {
                    ...prev,
                    [field]: value,
                    normal: newNormal,
                };
            });
        }
    };

    // useEffect(() => {
    //     // Filter items based on the selected filters
    //     let filtered = items;

    //     if (statusFilter) {
    //         filtered = filtered.filter(item =>
    //             item.status === statusFilter
    //         );
    //     }
    //     setFilteredItems(filtered);
    // }, [statusFilter, items]);
    const findItems = async () => {
        await axios.get<ResItemDetial>(`/api/items/${name}`)
        try {
            const res = await axios.get<ResItemDetial>(`/api/items/${params.name}`);
            const itemsData = res.data.data;

            setItems(itemsData); // ตั้งค่า items ทั้งหมด
            setItemDetail(itemsData[0]); // ตั้งค่า item แรก (หากจำเป็น)
            setPostfixSelect(itemsData[0].postfix.name)
            // คำนวณจำนวนของแต่ละสถานะ
            const normal = itemsData.filter((v) => v.status === 'ปกติ').length;
            const borrowed = itemsData.filter((v) => v.status === 'ถูกยืม').length;
            const damaged = itemsData.filter((v) => v.status === 'ชำรุด').length;
            const lost = itemsData.filter((v) => v.status === 'หาย').length;

            // ตั้งค่าจำนวนแต่ละสถานะใน state
            setItemsNum({
                normal: normal,
                borrowed: borrowed,
                damaged: damaged,
                lost: lost,
            });
        } catch (err) {
            console.error("Error fetching items:", err);
        }
    }

    const getDivision = async () => {
        await axios.get<ResDivision>('/api/division')
            .then((res) => {
                setDivision(res.data.data);
            }).catch((err) => console.error(err))
    }

    useEffect(() => {
        findItems();
        getPostfix();
        getDivision();
    }, [])

    // const startIdx = (currentPage - 1) * itemsPerPage;
    // const endIdx = startIdx + itemsPerPage;
    // const currentItems = filteredItems.slice(startIdx, endIdx);

    // const totalPages = Math.ceil(filteredItems!.length / itemsPerPage);

    return (
        <Side>
            <Card className="w-full p-2 mb-4">
                <CardHeader>
                    <h3 className="text-xl font-semibold">รายละเอียดอุปกรณ์</h3>
                </CardHeader>
                <CardContent className="text-lg">
                    {
                        itemDetail && (
                            <div className="flex justify-between items-start overflow-hidden w-full">
                                <img
                                    // src={process.env.NEXT_PUBLIC_BASE_PATH + '/' + itemDetail?.img}
                                    src={'http://172.20.48.135:9000/images' + '/items/' + itemDetail?.img}
                                    alt="item image"
                                    className="w-1/3 mr-4"
                                />
                                <div className="flex justify-start items-start flex-grow h-full flex-col">
                                    <div className=" items-center gap-2 mb-2 w-full">
                                        <Label htmlFor="name" className="text-left font-black">
                                            ชื่ออุปกรณ์
                                        </Label>
                                        <Input
                                            id="name"
                                            defaultValue={itemDetail?.name}
                                            className="text-stone-950 pointer-events-none border-0 bg-transparent w-full"
                                        />
                                    </div>
                                    <div className=" items-center gap-2 mb-2 w-full">
                                        <Label htmlFor="postfix" className="text-left font-black">
                                            หน่วย
                                        </Label>
                                        <Input
                                            id="postfix"
                                            defaultValue={itemDetail?.postfix.name}
                                            className="text-stone-950 pointer-events-none border-0 bg-transparent w-full"
                                        />
                                    </div>
                                    <div className="items-center gap-2 mb-2 w-full">
                                        <Label htmlFor="division" className="text-left font-black">
                                            ฝ่ายที่รับผิดชอบ
                                        </Label>
                                        <Input
                                            id="division"
                                            defaultValue={itemDetail?.division.name}
                                            className="text-stone-950 pointer-events-none border-0 bg-transparent w-full"
                                        />
                                    </div>
                                    <div className="items-center gap-2 mb-2 w-full">
                                        <Label htmlFor="total" className="text-left font-black">
                                            จำนวนทั้งหมด
                                        </Label>
                                        <div className="flex flex-wrap justify-start items-center gap-2">
                                            <Input
                                                id="total"
                                                defaultValue={`ทั้งหมด: ${items.length}`}
                                                className=" text-stone-950 pointer-events-none border-0 bg-transparent w-1/4"
                                            />
                                            <Input
                                                id="normal"
                                                defaultValue={`ปกติ: ${items.some((v) => v.status == 'ปกติ') ? items.filter((v) => v.status == 'ปกติ').length : '0'}`}
                                                className=" text-stone-950 pointer-events-none border-0 bg-transparent w-1/4"
                                            />
                                            <Input
                                                id="borrowed"
                                                defaultValue={`ถูกยืม: ${items.some((v) => v.status == 'ถูกยืม') ? items.filter((v) => v.status == 'ถูกยืม').length : '0'}`}
                                                className="text-stone-950 pointer-events-none border-0 bg-transparent w-1/4"
                                            />
                                            <Input
                                                id="damaged"
                                                defaultValue={`ชำรุด: ${items.some((v) => v.status == 'ชำรุด') ? items.filter((v) => v.status == 'ชำรุด').length : '0'}`}
                                                className="text-stone-950 pointer-events-none border-0 bg-transparent w-1/4"
                                            />
                                            <Input
                                                id="lost"
                                                defaultValue={`หาย: ${items.some((v) => v.status == 'หาย') ? items.filter((v) => v.status == 'หาย').length : '0'}`}
                                                className="text-stone-950 pointer-events-none border-0 bg-transparent w-1/4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            {itemDetail && itemDetail.division && itemDetail.division.name && (
                                <Button id="edit" onClick={() => setPosition(itemDetail.division.name)} type="button" className="bg-yellow-500 hover:bg-yellow-900 mr-2">
                                    <FaPen className="mr-2" />  แก้ไขโดยรวม
                                </Button>
                            )}
                        </DialogTrigger>
                        <DialogContent className="xl:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>ตรวจสอบอุปกรณ์</DialogTitle>
                                <DialogDescription>
                                    โปรดตรวจสอบให้ละเอียดก่อนกดยืนยัน
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 ">
                                <div className="flex justify-start items-start flex-grow h-full flex-col">
                                    <div className=" items-center gap-2 mb-2 w-full">
                                        <Label htmlFor="name" className="text-left font-black">
                                            ชื่ออุปกรณ์
                                        </Label>
                                        <Input
                                            id="name"
                                            defaultValue={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="text-stone-950 bg-transparent w-full"
                                        />
                                    </div>
                                    <div className="items-start justify-start flex flex-col gap-2 mb-2 w-full">
                                        <Label htmlFor="division" className="text-left font-black">
                                            เลือกหน่วย
                                        </Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">{postfixSelect}</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56 h-96 overflow-y-scroll">
                                                <DropdownMenuLabel>หน่วย</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuRadioGroup value={postfixSelect} onValueChange={setPostfixSelect}>
                                                    {
                                                        postfix.map((v, i) => (
                                                            <DropdownMenuRadioItem key={i} value={v.name}>{v.name}</DropdownMenuRadioItem>
                                                        ))
                                                    }
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="items-start justify-start flex flex-col gap-2 mb-2 w-full">
                                        <Label htmlFor="division" className="text-left font-black">
                                            ฝ่ายที่รับผิดชอบ
                                        </Label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">{position}</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuLabel>ฝ่ายทั้งหมด</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                                    {
                                                        division.map((v, i) => (
                                                            <DropdownMenuRadioItem key={i} value={v.name}>{v.name}</DropdownMenuRadioItem>
                                                        ))
                                                    }
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="items-center gap-2 mb-2 w-full">
                                        <Label htmlFor="total" className="text-left font-black">
                                            จำนวนทั้งหมด
                                        </Label>
                                        <div className="flex justify-start items-center gap-2">
                                            <div>
                                                <Label htmlFor="normal" className="text-left font-black">
                                                    ปกติ
                                                </Label>
                                                <Input
                                                    id="normal"
                                                    type="number"
                                                    inputMode="numeric"
                                                    readOnly
                                                    min="0"
                                                    max={totalItems}
                                                    step="1"
                                                    value={itemsNum.normal}
                                                    onChange={(e) => handleChange('normal', +e.target.value)}
                                                    className=" text-stone-950 bg-transparent"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="borrowed" className="text-left font-black">
                                                    ถูกยืม
                                                </Label>
                                                <Input
                                                    id="borrowed"
                                                    type="number"
                                                    min="0"
                                                    max={totalItems}
                                                    step="1"
                                                    value={itemsNum.borrowed}
                                                    onChange={(e) => handleChange("borrowed", +e.target.value)}
                                                    className="text-stone-950 bg-transparent"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="damaged" className="text-left font-black">
                                                    ชำรุด
                                                </Label>
                                                <Input
                                                    id="damaged"
                                                    type="number"
                                                    min="0"
                                                    max={totalItems}
                                                    step="1"
                                                    value={itemsNum.damaged}
                                                    onChange={(e) => handleChange("damaged", +e.target.value)}
                                                    className="text-stone-950 bg-transparent"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lost" className="text-left font-black">
                                                    หาย
                                                </Label>
                                                <Input
                                                    id="lost"
                                                    type="number"
                                                    min="0"
                                                    max={totalItems}
                                                    step="1"
                                                    value={itemsNum.lost}
                                                    onChange={(e) => handleChange("lost", +e.target.value)}
                                                    className="text-stone-950 bg-transparent"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" onClick={() => updateAll()} className='bg-blue-900'>ยืนยัน</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button id="add" type="button" className="bg-green-500 hover:bg-green-900 mr-2">
                                <FaCirclePlus className='mr-2' onClick={() => setClone(0)} /> เพิ่มอุปกรณ์นี้
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>เพิ่มอุปกรณ์นี้</DialogTitle>
                                <DialogDescription>
                                    โปรดระบุจำนวนอุปกรณ์ที่ต้องการเพิ่ม
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 ">
                                <div className="flex justify-start items-start flex-grow h-full flex-col">
                                    <div className=" items-center gap-2 mb-2 w-full">
                                        <Label htmlFor="name" className="text-left font-black">
                                            จำนวนที่ต้องการเพิ่ม
                                        </Label>
                                        <Input
                                            id="items"
                                            type="number"
                                            min="1"
                                            required
                                            onChange={(e) => setClone(Number(e.target.value))}
                                            className="text-stone-950 bg-transparent w-1/4"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    {itemDetail && (
                                        <Button type="button" onClick={() => cloneItem(itemDetail.id, clone)}
                                            className={`bg-blue-900 ${clone <= 0 ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>ยืนยัน</Button>
                                    )}
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button id="del" type="button" className={`bg-red-500 hover:bg-red-900 ${totalItems == 1 ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>
                                <FaCircleMinus className="mr-2" onClick={() => setClone(0)} /> ลบอุปกรณ์นี้ตามจำนวน
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>ลบอุปกรณ์นี้ตามจำนวน</DialogTitle>
                                <DialogDescription>โปรดระบุจำนวนอุปกรณ์ที่ต้องการลบ</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 ">
                                <div className="flex justify-start items-start flex-grow h-full flex-col">
                                    <div className="items-center gap-2 mb-2 w-full">
                                        <Label htmlFor="name" className="text-left font-black">
                                            จำนวนที่ต้องการลบ
                                        </Label>
                                        <Input
                                            id="items"
                                            type="number"
                                            min="1"
                                            required
                                            onChange={(e) => setClone(Number(e.target.value))}
                                            className="text-stone-950 bg-transparent w-1/4"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                {itemDetail && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            {clone > (totalItems - 1) ?
                                                <p className="text-red-500">จำนวนที่ต้องการลบต้องน้อยกว่าจำนวนทั้งหมดที่มี 1 {itemDetail.postfix.name}</p>
                                                :
                                                <Button id="confirm-del" type="button" className={`bg-red-500 hover:bg-red-900 ${clone <= 0 ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''} ${clone > (totalItems - 1) ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>
                                                    ยืนยัน
                                                </Button>
                                            }

                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>ต้องการลบอุปกรณ์นี้จำนวน {clone} {' ' + itemDetail.postfix.name} จริงหรือไม่</DialogTitle>
                                                <DialogDescription>
                                                    ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                {itemDetail && (
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            onClick={() => deleteItem(itemDetail.name, clone)}
                                                            className={`bg-red-500 mr-2 hover:bg-red-900 ${clone <= 0 ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''
                                                                }`}
                                                        >
                                                            ยืนยัน
                                                        </Button>
                                                    </DialogClose>
                                                )}
                                                <DialogClose asChild>
                                                    <Button type="button">ยกเลิก</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>


        </Side>
    );
}


/* <Card className="w-full p-2">
                <CardHeader>
                    <div className="mb-4 flex gap-4 flex-wrap">
                        <h3 className="text-xl font-semibold">{name}</h3>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border rounded"
                        >
                            <option value="">สถานะ</option>
                            <option value="ปกติ">ปกติ</option>
                            <option value="ถูกยืม">ถูกยืม</option>
                            <option value="ชำรุด">ชำรุด</option>
                            <option value="หาย">หาย</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-800 ">
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center ">#</TableHead>
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center">ภาพประกอบ</TableHead>
                                <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่ออุปกรณ์</TableHead>
                                <TableHead className="text-center text-stone-950 border-r border-gray-300 text-center">
                                    สถานะ
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <TableRow key={index} className="border-b border-gray-300 ">
                                        <TableCell className="font-medium border-r border-gray-300 text-center">{index + 1 + startIdx}</TableCell>
                                        <TableCell className="border-r border-gray-300 text-center">
                                            <div className="group group-hover:relative overflow-hidden">
                                              
                                                <div className="flex  justify-center items-center overflow-hidden">
                                                    <img
                                                        src={item.img!}
                                                        width={90}
                                                        height={90}
                                                        alt="item image"
                                                        className="transform  transition-all duration-300"
                                                    />
                                                </div>

                                               
                                                <div className={`absolute w-1/5 hidden group-hover:flex justify-center items-center
                                                     right-1/2 transform z-100 
                                                    `}
                                                >
                                                    <img
                                                        src={item.img!}
                                                        alt="Zoomed image"
                                                        className="transform w-full absolute"
                                                    />
                                                </div>
                                            </div>
                                          
                                        </TableCell>
                                        <TableCell className="border-r border-gray-300 text-center">{item.name}</TableCell>
                                        <TableCell className="border-r border-gray-300 text-center text-center">
                                            {
                                                item.status == 'ปกติ' ? 'ปกติ'
                                                    : item.status == 'หาย' ? 'หาย'
                                                        : item.status == 'ถูกยืม' ? 'ถูกยืม'
                                                            : item.status == 'ชำรุด' ? 'ชำรุด' : 'อื่นๆ'
                                            }
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
                <CardFooter className="flex justify-center items-center w-full">
                    {currentItems.length > 0 && (
                        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                </CardFooter>
            </Card> */