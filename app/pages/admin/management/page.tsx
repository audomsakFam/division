'use client'
import Side from "@/app/components/side/side";
import { ResOri, ResOriData } from "@/app/interfaces/ori";
import { PerviewData, ResPerview } from "@/app/interfaces/preview";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { PostfixData, ResPostfix } from "@/app/interfaces/postfix";
import { Set } from "@prisma/client";

export default function Management() {
    const [previewData, setPerviewData] = useState<PerviewData[]>([]);
    const [fileL, setFileL] = useState<File | null>(null);
    const [previewUrlL, setPreviewUrlL] = useState<string | null>(null);
    const [fileR, setFileR] = useState<File | null>(null);
    const [previewUrlR, setPreviewUrlR] = useState<string | null>(null);
    const [fileVideo, setFileVideo] = useState<File | null>(null);
    const [ori, setOri] = useState<ResOriData[]>([]);
    const [postfix, setPostfix] = useState<PostfixData[]>([]);
    const [isOpenOri, setIsOpenOri] = useState(ori.map(() => false));
    const [set, setSet] = useState<Set[]>([]);
    const [isOpenPost, setIsOpenPost] = useState(postfix.map(() => false));
    const [isOpenSet, setIsOpenSet] = useState(set.map(() => false));
    const [isOpenPostCreate, setIsOpenPostCreate] = useState(false);
    const [isOpenSetCreate, setIsOpenSetCreate] = useState(false);
    const [isOpenOriCreate, setIsOpenOriCreate] = useState(false);
    const [postName, setPostName] = useState('');
    const [setName, setSetName] = useState('');
    const [oriName, setOriName] = useState('');
    const [position, setPosition] = useState("")
    const handleOpenChange = (index: any, open: any) => {
        const newIsOpenOri = [...isOpenOri];
        newIsOpenOri[index] = open;
        setIsOpenOri(newIsOpenOri);
    };

    const handleOpenChangePost = (index: any, open: any) => {
        const newIsOpenPost = [...isOpenPost];
        newIsOpenPost[index] = open;
        setIsOpenPost(newIsOpenPost);
    };

    const handleOpenChangeSet = (index: any, open: any) => {
        const newIsOpenSet = [...isOpenSet];
        newIsOpenSet[index] = open;
        setIsOpenSet(newIsOpenSet);
    };

    const deletePost = async (id: number) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/postfix?id=${id}`);
            if (res.status === 200) {
                fetchPostfix();
                console.log(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }
    const deleteSet = async (id: number) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/set?id=${id}`);
            if (res.status === 200) {
                getSet();
                console.log(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const deleteOri = async (id: number) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/Origanization?id=${id}`);
            if (res.status === 200) {
                fetchOri();
                console.log(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getSet = async () => {
        try {
            const data = await axios.get(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/set`);
            if (data.status === 200) {
                setSet(data.data.data);
            } else {
                throw new Error(data.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const createPost = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/postfix`, { name: postName });
            if (res.status === 200) {
                setPostName('');
                fetchPostfix();
                console.log(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }
    const createSet = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/set`, { name: setName });
            if (res.status === 200) {
                setSetName('');
                getSet();
                console.log(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const createOri = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/Origanization`, { name: oriName, group: Number(position) });
            if (res.status === 200) {
                setOriName('');
                setPosition('');
                fetchOri();
                console.log(res.data);
            }
        } catch (error) {
            console.error(error)
        }
    }


    const fetchOri = async () => {
        try {
            const res = await axios.get<ResOri>(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/Origanization`);
            setOri(res.data.data);
        } catch (err) {
            console.log('error ---> ', err);
        }
    }
    const fetchPostfix = async () => {
        try {
            const res = await axios.get<ResPostfix>(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/postfix`);
            setPostfix(res.data.data);
        } catch (err) {
            console.log('error ---> ', err);
        }
    }

    const fetchPerview = async () => {
        try {
            const res = await axios.get<ResPerview>(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/preview`);
            setPerviewData(res.data.res);
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileChangeL = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFileL(selectedFile);

            const preview = URL.createObjectURL(selectedFile);
            setPreviewUrlL(preview);
        }
    };
    const handleUploadL = async () => {
        if (fileL) {
            const type = 0;
            await uploadFile(fileL, type);
            await fetchPerview();
        } else {
            console.error("No file selected.");
        }
    };
    const handleFileChangeR = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFileR(selectedFile);

            const preview = URL.createObjectURL(selectedFile);
            setPreviewUrlR(preview);
        }
    };
    const handleUploadR = async () => {
        if (fileR) {
            const type = 1;
            await uploadFile(fileR, type);
            await fetchPerview();
        } else {
            console.error("No file selected.");
        }
    };

    const handleFileVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFileVideo(selectedFile);
        }
    };
    const handleUploadVideo = async () => {
        if (fileVideo) {
            const type = 2;
            await uploadFile(fileVideo, type);
            await fetchPerview();
        } else {
            console.error("No file selected.");
        }
    };

    const uploadFile = async (file: File, type: number) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", String(type));

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/preview`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                console.log("File uploaded successfully:", response.data);
                if (type == 0) {
                    setFileL(null);
                    setPreviewUrlL('');
                }
                if (type == 1) {
                    setFileR(null);
                    setPreviewUrlR('');
                }
                if (type == 2) {
                    setFileVideo(null);
                }
            } else {
                console.error("Error uploading file:", response.data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchOri();
        fetchPerview();
        getSet();
        fetchPostfix();
    }, [])
    return (
        <Side>

            <div className="flex justify-between flex-wrap">
                <Card className="flex-grow m-2">
                    <CardHeader>
                        <CardTitle>แบนเนอร์</CardTitle>
                        <CardDescription>แบนเนอร์ที่ Home Page</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[460px] overflow-hidden flex flex-col">
                        <div className="flex justify-center items-center h-full ">
                            {previewData.map((item) => (
                                <>
                                    {item.type == 0 && (
                                        <div className="flex w-1/2 flex-col h-full mr-2">
                                            <Label>แบนเนอร์ ซ้าย</Label>
                                            <div className="w-full h-full relative overflow-y-auto">
                                                {previewUrlL ? (
                                                    <img
                                                        src={previewUrlL}
                                                        className="w-full h-full object-cover rounded-md"
                                                        alt="Preview"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/${item.name}`}
                                                            className="w-full h-full object-cover rounded-md"
                                                            alt="Preview"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {item.type == 1 && (
                                        <div className="flex w-1/2 flex-col h-full mr-2">
                                            <Label>แบนเนอร์ ขวา</Label>
                                            <div className="w-full h-full relative overflow-y-auto">
                                                {previewUrlR ? (
                                                    <img
                                                        src={previewUrlR}
                                                        className="w-full h-full object-cover rounded-md"
                                                        alt="Preview"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/${item.name}`}
                                                            className="w-full h-full object-cover rounded-md"
                                                            alt="Preview"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <div className="flex w-full ">
                            {fileL ? (
                                <div className="w-1/2 flex flex-col justify-center items-center">
                                    <button
                                        onClick={handleUploadL}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
                                    >
                                        อัปโหลดแบนเนอร์ ซ้าย
                                    </button>
                                    <button
                                        onClick={() => { setFileL(null); setPreviewUrlL('') }}
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col w-1/2 justify-center items-center">
                                    <label
                                        htmlFor="fileInputL"
                                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-600"
                                    >
                                        เปลี่ยนแบนเนอร์ ซ้าย
                                    </label>
                                    <input
                                        id="fileInputL"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChangeL}
                                        className="hidden"
                                    />
                                </div>
                            )}
                            {fileR ? (
                                <div className="w-1/2 flex flex-col justify-center items-center">
                                    <button
                                        onClick={handleUploadR}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
                                    >
                                        อัปโหลดแบนเนอร์ ขวา
                                    </button>
                                    <button
                                        onClick={() => { setFileR(null); setPreviewUrlR("") }}
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col w-1/2 justify-center items-center">
                                    <label
                                        htmlFor="fileInputR"
                                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-600"
                                    >
                                        เปลี่ยนแบนเนอร์ ขวา
                                    </label>
                                    <input
                                        id="fileInputR"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChangeR}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </CardFooter>
                </Card>
                <Card className="flex-grow m-2">
                    <CardHeader>
                        <CardTitle>วิดีโอ</CardTitle>
                        <CardDescription>วิดีโอที่ Home Page</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[450px] flex items-center justify-center w-full">
                        <div className="w-full flex justify-around">
                            {
                                previewData.map((item) => (
                                    <>
                                        {
                                            item.type == 2 && (
                                                <div className="w-full mb-4 flex items-center justify-center">
                                                    <ReactPlayer url={`${process.env.NEXT_PUBLIC_BASE_PATH}/${item.name}`} width="100%" controls={true} />
                                                </div>
                                            )
                                        }
                                    </>
                                ))
                            }
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end ">
                        <div className="flex w-full ">
                            {fileVideo ? (
                                <div className=" w-full flex flex-col justify-center items-center">
                                    <button
                                        onClick={handleUploadVideo}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
                                    >
                                        อัปโหลด Vedio
                                    </button>
                                    <button
                                        onClick={() => { setFileVideo(null) }}
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col w-full justify-center items-center">
                                    <label
                                        htmlFor="fileInputV"
                                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-600"
                                    >
                                        เปลี่ยน Vedio
                                    </label>
                                    <input
                                        id="fileInputV"
                                        type="file"
                                        onChange={handleFileVideo}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="flex justify-between flex-wrap">
                <Card className="flex-grow m-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>องค์กร/หน่วยงาน</CardTitle>
                            <Dialog open={isOpenOriCreate} onOpenChange={(open) => {
                                setIsOpenOriCreate(open)
                                setOriName("");
                                setPosition("");
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-500 hover:bg-blue-800" onClick={() => { setOriName(""); setPosition("") }} >เพิ่มองค์กร/หน่วยงานใหม่</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>เพิ่มองค์กร/หน่วยงานใหม่</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-2">
                                        <div className="grid flex-1 gap-2">
                                            <Label htmlFor="namePost" className="sr-only">
                                                ชื่อองค์กร/หน่วยงาน
                                            </Label>
                                            <Input
                                                value={oriName}
                                                onChange={(e) => setOriName(e.target.value)}
                                                placeholder="ชื่อองค์กร/หน่วยงาน"
                                                id="namePost"
                                            />
                                        </div>
                                        <div className="grid flex-1 gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline">{position == "" ? "เลือกประเภท" : (position == "0" ? "บุคลากร" : "นักศึกษา")}</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuLabel>ประเภท</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                                        <DropdownMenuRadioItem value="0">บุคลากร</DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem value="1">นักศึกษา</DropdownMenuRadioItem>
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" onClick={() => createOri()}
                                                className={`bg-blue-500 hover:bg-blue-800 ${(oriName == "") || (position == "") ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`} >
                                                ยืนยัน
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                ยกเลิก
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[460px] overflow-y-scroll">
                        <Table>
                            <TableHeader>
                                <TableRow className="">
                                    <TableHead className="w-[100px]">#</TableHead>
                                    <TableHead>ชื่อ</TableHead>
                                    <TableHead>สำหรับ</TableHead>
                                    <TableHead>ดำเนินการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    ori.map((v, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{v.name}</TableCell>
                                            <TableCell>{v.group == 0 ? "บุคลากร" : "นักศึกษา"}</TableCell>
                                            <TableCell>
                                                <Dialog open={isOpenOri[i]} onOpenChange={(open) => handleOpenChange(i, open)}>
                                                    <DialogTrigger asChild>
                                                        <Button className="bg-red-500 hover:bg-red-800" >ลบ</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>ต้องการลบองค์กร/หน่วยงาน {v.name} จริงหรือไม่</DialogTitle>
                                                            <DialogDescription>
                                                                ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="sm:justify-start">
                                                            <DialogClose asChild>
                                                                <div className="flex gap-2">
                                                                    <Button type="button" variant="destructive" onClick={() => deleteOri(v.id)}>
                                                                        ยืนยัน
                                                                    </Button>
                                                                    <Button type="button" variant="secondary">
                                                                        ยกเลิก
                                                                    </Button>
                                                                </div>
                                                            </DialogClose>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end">

                    </CardFooter>
                </Card>
                <Card className="flex-grow m-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>หน่วย/อุปกรณ์</CardTitle>

                            <Dialog open={isOpenPostCreate} onOpenChange={(open) => {
                                setIsOpenPostCreate(open)
                                setPostName("");
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-500 hover:bg-blue-800" onClick={() => setPostName("")}>เพิ่มหน่วยอุปกรณ์ใหม่</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>เพิ่มหน่วยอุปกรณ์ใหม่</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-2">
                                        <div className="grid flex-1 gap-2">
                                            <Label htmlFor="namePost" className="sr-only">
                                                ชื่อหน่วย
                                            </Label>
                                            <Input
                                                value={postName}
                                                onChange={(e) => setPostName(e.target.value)}
                                                placeholder="ชื่อหน่วย"
                                                id="namePost"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" onClick={() => createPost()}
                                                className={`bg-blue-500 hover:bg-blue-800 ${postName == "" ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`} >
                                                ยืนยัน
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                ยกเลิก
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[460px] overflow-y-scroll">
                        <Table>
                            <TableHeader>
                                <TableRow className="">
                                    <TableHead >#</TableHead>
                                    <TableHead>หน่วย</TableHead>
                                    <TableHead>ดำเนินการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    postfix.map((v, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{v.name}</TableCell>
                                            <TableCell>
                                                <Dialog open={isOpenPost[i]} onOpenChange={(open) => {
                                                    handleOpenChangePost(i, open)
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button className="bg-red-500 hover:bg-red-800" >ลบ</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>ต้องการลบหน่วย {v.name} จริงหรือไม่</DialogTitle>
                                                            <DialogDescription>
                                                                ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="sm:justify-start">
                                                            <DialogClose asChild>
                                                                <div className="flex gap-2">
                                                                    <Button type="button" variant="destructive" onClick={() => deletePost(v.id)}>
                                                                        ยืนยัน
                                                                    </Button>
                                                                    <Button type="button" variant="secondary">
                                                                        ยกเลิก
                                                                    </Button>
                                                                </div>
                                                            </DialogClose>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end">

                    </CardFooter>
                </Card>

            </div>
            <Card className="flex-grow m-2">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>ชุดอุปกรณ์</CardTitle>

                        <Dialog open={isOpenSetCreate} onOpenChange={(open) => {
                            setIsOpenSetCreate(open)
                            setSetName("");
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-500 hover:bg-blue-800" onClick={() => setSetName("")}>เพิ่มชุดอุปกรณ์ใหม่</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>เพิ่มชุดอุปกรณ์ใหม่</DialogTitle>
                                </DialogHeader>
                                <div className="flex items-center space-x-2">
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor="namePost" className="sr-only">
                                            ชื่อชุดอุปกรณ์
                                        </Label>
                                        <Input
                                            value={setName}
                                            onChange={(e) => setSetName(e.target.value)}
                                            placeholder="ชื่อชุดอุปกรณ์"
                                            id="namePost"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="sm:justify-start">
                                    <DialogClose asChild>
                                        <Button type="button" onClick={() => createSet()}
                                            className={`bg-blue-500 hover:bg-blue-800 ${setName == "" ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`} >
                                            ยืนยัน
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                            ยกเลิก
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="overflow-y-scroll">
                    <Table>
                        <TableHeader>
                            <TableRow className="">
                                <TableHead >#</TableHead>
                                <TableHead>ชุดอุปกรณ์</TableHead>
                                <TableHead>ดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                set.map((v, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{v.name}</TableCell>
                                        <TableCell>
                                            <Dialog open={isOpenSet[i]} onOpenChange={(open) => {
                                                handleOpenChangeSet(i, open)
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button className="bg-red-500 hover:bg-red-800" >ลบ</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>ต้องการลบชุดอุปกรณ์ {v.name} จริงหรือไม่</DialogTitle>
                                                        <DialogDescription>
                                                            ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="sm:justify-start">
                                                        <DialogClose asChild>
                                                            <div className="flex gap-2">
                                                                <Button type="button" variant="destructive" onClick={() => deleteSet(v.id)}>
                                                                    ยืนยัน
                                                                </Button>
                                                                <Button type="button" variant="secondary">
                                                                    ยกเลิก
                                                                </Button>
                                                            </div>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-end">

                </CardFooter>
            </Card>
        </Side>
    );
}