'use client';
import Side from "@/app/components/side/side";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ResItemsGroup } from "@/app/interfaces/item";
import PaginationComponent from "@/app/components/pagination/pagination";
import { ClearItemCache, GetItemWithCache } from "@/lib/servers/getItemWithCache";
// import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ResDivision, ResDivisionData } from "@/app/interfaces/division";
import axios from "axios";
import { PostfixData, ResPostfix } from "@/app/interfaces/postfix";

const itemsPerPage = 20;
export default function Items() {
    const [items, setItems] = useState<ResItemsGroup[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filteredItems, setFilteredItems] = useState<ResItemsGroup[]>([]);
    const [nameFilter, setNameFilter] = useState('');
    const [divisionFilter, setDivisionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [statusOptions, setStatusOptions] = useState<{ status: string, count: number }[]>([]);
    const router = useRouter();
    const [newName, setNewName] = useState('')
    const [clone, setClone] = useState(1)
    const [position, setPosition] = useState('เลือกฝ่าย')
    const [division, setDivision] = useState<ResDivisionData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [postfixSelect, setPostfixSelect] = useState('เลือกหน่วย')
    const [postfix, setPostfix] = useState<PostfixData[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const resetForm = () => {
        setPreview(null);
        setNewName("");
        setClone(1);
        setPosition("เลือกฝ่าย");
        setPostfixSelect("เลือกหน่วย");
    };

    const getDivision = async () => {
        await axios.get<ResDivision>(process.env.NEXT_PUBLIC_BASE_PATH+'/api/division')
            .then((res) => {
                setDivision(res.data.data);
            }).catch((err) => console.error(err))
    }

    const getPostfix = async () => {
        await axios.get<ResPostfix>(process.env.NEXT_PUBLIC_BASE_PATH+'/api/postfix')
            .then((res) => {
                setPostfix(res.data.data);
            }).catch((err) => console.error(err))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setImage(file);
        setPreview(previewUrl); // สร้าง URL สำหรับแสดงตัวอย่างรูปภาพ
    };

    const createitems = async () => {
        try {
            if (!image) {
                alert("Please select an image.");
                return;
            }

            const fData = new FormData();
            fData.append("image", image);
            fData.append("name", newName);
            fData.append("division", position);
            fData.append("postfix", postfixSelect);
            fData.append("count", clone.toString());

            const res = await axios.post(process.env.NEXT_PUBLIC_BASE_PATH+'/api/items/newItem', fData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(res);
            ClearItemCache();
            GetItemWithCache().then((res) => {
                setItems(res);
                setFilteredItems(res);  // Set the filtered items to the full list initially
            });
        } catch (err) {
            console.error(err)
        }
    }

    const deleteItem = async (name: string, imgName: string) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/items/deleteMany?name=${name}&imgName=${imgName}`);
            console.log(res);
            ClearItemCache();
            GetItemWithCache().then((res) => {
                setItems(res);
                setFilteredItems(res);  // Set the filtered items to the full list initially
            });
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        GetItemWithCache().then((res) => {
            setItems(res);
            setFilteredItems(res);  // Set the filtered items to the full list initially
        });
        getDivision();
        getPostfix();
    }, [])

    useEffect(() => {
        if (items.length > 0) {
            const statusCounts = items.reduce((acc, item) => {
                item.statusCounts.forEach(key => {
                    // ถ้าสถานะยังไม่เคยถูกเพิ่ม
                    if (!acc[key.status]) { // เช็คและกำหนด key
                        acc[key.status] = 0; // กำหนด value ของ key นั้นๆ เป็น Integer เริ่มจาก 0
                    }
                    acc[key.status] += key.count;  // เพิ่ม value ไปที่ key ที่ตรงกัน และเพิ่มจำนวนไปเรื่อยๆ
                });
                // console.log('acc data ------> ', acc) 
                return acc; // { index 0 "key1":0, index 1 "key2":0, ...ถ้าเป็น key ใหม่ที่ไม่ซ้ำกับที่มีอยู่จะถูกเพิ่ม ถ้าซ้ำจะถูกรวมเข้ากับอันเก่า และเพิ่มจำนวน}
            }, {} as { [key: string]: number });

            // เปลี่ยนเป็นอาร์เรย์ของสถานะและจำนวน
            const statusesWithCount = Object.keys(statusCounts).map(status => ({
                status,
                count: statusCounts[status],
            }));

            setStatusOptions(statusesWithCount);
        }
    }, [items]);

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

        if (statusFilter) {
            filtered = filtered.filter(item =>
                item.statusCounts.some(status => status.status === statusFilter)
            );
        }
        setCurrentPage(1);
        setFilteredItems(filtered);
    }, [nameFilter, statusFilter, divisionFilter, items]);

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = filteredItems.slice(startIdx, endIdx);

    const totalPages = Math.ceil(filteredItems!.length / itemsPerPage);

    return (
        <Side>
            <div >
                <Card className="w-full p-2">
                    <CardHeader>
                        <h3 className="text-xl font-semibold">อุปกรณ์</h3>
                        <div className="mb-4 flex gap-4 flex-wrap items-center">
                            <input
                                type="text"
                                placeholder="ค้นหาชื่ออุปกรณ์"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="px-4 py-2 border rounded"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border rounded"
                            >
                                <option value="">สถานะ (แสดงเฉพาะสถานะที่มีข้อมูล)</option>
                                {
                                    statusOptions.map((statusObj, index) => (
                                        <option key={index} value={statusObj.status}>
                                            {statusObj.status}
                                            {/* ({statusObj.count}) */}
                                        </option>
                                    ))
                                }
                            </select>

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

                            <Dialog open={isOpen} onOpenChange={(open) => {
                                setIsOpen(open);
                                if (!open) resetForm(); // เคลียร์ข้อมูลเมื่อ dialog ถูกปิด
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="bg-green-600 hover:bg-green-900">
                                        <FaCirclePlus className="mr-2" /> เพิ่มอุปกรณ์ใหม่
                                    </Button>
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
                                            <div>
                                                <Label htmlFor="image">เลือกรูปภาพ:</Label>
                                                <Input
                                                    className="cursor-pointer"
                                                    type="file"
                                                    id="image"
                                                    name="image"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    required
                                                />
                                            </div>
                                            {preview && (
                                                <div style={{ margin: "10px 0" }}>
                                                    <p>Preview:</p>
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        style={{ width: "200px", height: "auto", border: "1px solid #ddd" }}
                                                    />
                                                </div>
                                            )}
                                            <div className=" items-center gap-2 mb-2 w-full">
                                                <Label htmlFor="name" className="text-left font-black">
                                                    ชื่ออุปกรณ์
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="text-stone-950 bg-transparent w-full"
                                                />
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
                                                <div className="flex justify-start items-center gap-2">
                                                    <div className=" items-center gap-2 mb-2 w-full">
                                                        <Label htmlFor="name" className="text-left font-black">
                                                            จำนวนที่ต้องการเพิ่ม
                                                        </Label>
                                                        <Input
                                                            id="items"
                                                            type="number"
                                                            min="1"
                                                            required
                                                            defaultValue={clone}
                                                            onChange={(e) => setClone(Number(e.target.value))}
                                                            className="text-stone-950 bg-transparent w-1/4"
                                                        />
                                                    </div>
                                                </div>
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
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" onClick={(e) => { createitems(); e.stopPropagation() }} className='bg-blue-900'>ยืนยัน</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-gray-800 ">
                                    <TableHead className="text-stone-950 border-r border-gray-300 text-center ">#</TableHead>
                                    <TableHead className="text-stone-950 border-r border-gray-300 text-center">ภาพประกอบ</TableHead>
                                    <TableHead className="text-stone-950 border-r border-gray-300 text-center">ชื่ออุปกรณ์</TableHead>
                                    <TableHead className="text-stone-950 border-r border-gray-300 text-center">
                                        <div className="text-stone-950 mb-2 border-b border-gray-300">จำนวน</div>
                                        <div className="flex justify-around ">
                                            <div className="text-stone-950 border-r border-gray-300 flex items-center justify-center w-full">ทั้งหมด</div>
                                            <div className="text-stone-950 flex items-center justify-center w-full">คงเหลือ</div>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center text-stone-950 border-r border-gray-300 text-center">
                                        <div className="mb-2 border-b border-gray-300">สถานะ</div>
                                        <div className="flex justify-around ">
                                            <div className="text-stone-950 border-r border-gray-300 flex items-center justify-center w-full">ปกติ</div>
                                            <div className="text-stone-950 border-r border-gray-300 flex items-center justify-center w-full">ถูกยืม</div>
                                            <div className="text-stone-950 border-r border-gray-300 flex items-center justify-center w-full">ชำรุด</div>
                                            <div className="text-stone-950 flex items-center justify-center w-full">หาย</div>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-stone-950 border-r border-gray-300 text-center">หน่วย</TableHead>
                                    <TableHead className="text-stone-950 border-r border-gray-300 text-center">ฝ่ายที่รับผิดชอบ</TableHead>
                                    <TableHead className="text-stone-950 text-center">ดำเนินการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
                                        <TableRow onClick={() => router.push(`/pages/admin/itemDetail/${item.name}`)} key={index} className="cursor-pointer border-b border-gray-300 ">
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
                                                {/* <QRCodeSVG
                                                        value={'https://www.google.co.th/?hl=th'}       // ข้อความหรือ URL ที่ต้องการสร้าง QR Code
                                                        size={120}            // ขนาดของ QR Code
                                                        bgColor="#ffffff"     // สีพื้นหลังของ QR Code
                                                        fgColor="#000000"     // สีของ QR Code
                                                        level="H"             // ระดับความหนาแน่นของ QR Code
                                                        includeMargin={true}  // เพิ่ม margin รอบ QR Code
                                                    /> */}
                                            </TableCell>
                                            <TableCell className="border-r border-gray-300 text-start">{item.name}</TableCell>
                                            <TableCell className="border-r border-gray-300 text-center">
                                                <div className="flex justify-around ">
                                                    <div className="border-r border-gray-300 flex items-center justify-center w-full">
                                                        {item.statusCounts.reduce((total, status) => total + status.count, 0)}
                                                    </div>
                                                    <div className="flex items-center justify-center w-full">
                                                        {item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-gray-300 text-center text-center">
                                                <div className="flex justify-around ">
                                                    <div className="border-r border-gray-300 flex items-center justify-center w-full">{item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0}</div>
                                                    <div className="border-r border-gray-300 flex items-center justify-center w-full">{item.statusCounts.find(v => v.status === 'ถูกยืม')?.count ?? 0}</div>
                                                    <div className="border-r border-gray-300 flex items-center justify-center w-full">{item.statusCounts.find(v => v.status === 'ชำรุด')?.count ?? 0}</div>
                                                    <div className="flex items-center justify-center w-full">{item.statusCounts.find(v => v.status === 'หาย')?.count ?? 0}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r border-gray-300 text-center">{item.postfixName}</TableCell>
                                            <TableCell className="border-r border-gray-300 text-center">{item.divisionName}</TableCell>
                                            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant={'destructive'}>
                                                            <FaCircleMinus className="mr-2" /> ลบอุปกรณ์
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
                                                                    <Button type="submit" className="bg-red-600 hover:bg-red-900 mr-2" onClick={(e) => { deleteItem(item.name,item.img); e.stopPropagation() }}>ยืนยัน</Button>
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
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-center items-center w-full">
                        {currentItems.length > 0 && (
                            <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        )}
                    </CardFooter>
                </Card>
            </div>
        </Side>
    );
}


