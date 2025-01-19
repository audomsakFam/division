'use client'
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { FaFloppyDisk } from "react-icons/fa6";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import axios, { AxiosResponse } from "axios";
import { CustomUserSession } from "@/app/interfaces/user";
import Side from "@/app/components/side/side";

export default function Profile() {
    const { data, status, update } = useSession();
    const session = data as CustomUserSession | null;
    const [gender, setGender] = React.useState("")
    const [email, setEmail] = useState('')
    const [lastname, setLastname] = useState('')
    const [tel, setTel] = useState('')
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const [changeP, setChangeP] = useState(false);
    const [showDialogEdit, setShowDialogEdit] = useState(false);
    const [showDialogUpload, setShowDialogUpload] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [uploadImage, setUploadImage] = useState<File | null>(null);

    const handleDialogClose = (isOpen: boolean, dialogId: number) => {
        if (!isOpen) {
            setName('');
            setLastname('');
            setTel('');
            setEmail('');
            setGender('');
            setPassword('');
            setUsername('');
            setNewPassword('');
            setCPassword('');
            setChangeP(false);
            setShowDialogEdit(false);
            setShowDialogUpload(false);
            setPreviewImage(null);
        }
        if (isOpen) {
            setName(session!.user.name);
            setLastname(session!.user.lastname);
            setTel(session!.user.tel);
            setName(session!.user.name);
            setEmail(session!.user.email);
            setGender(session!.user.gender);
            setUsername(session!.user.username);
            if (dialogId == 1) {
                setShowDialogUpload(isOpen);
                return

            }
            if (dialogId == 2) {
                setShowDialogEdit(isOpen);
                return

            }
        }
    };
    const uploadImg = async () => {
        try {
            const formData = new FormData();
            formData.append("image", uploadImage!);
            if (session) formData.append("id", session.user.id.toString());

            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/user/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return await update(res.data.res);
        } catch (error) {
            console.error("Error uploading profile image:", error);
        }
    }
    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setUploadImage(file);
    };
    const submit = async (userId: number) => {
        if (name == '' || email == '' || gender == '' || tel == '' || lastname == '' || username == '') {
            return setShowAlert(true);
        }
        if (changeP && !newPassword && !password && !cPassword) {
            return setShowAlert(true);
        }
        if (changeP && newPassword && password && cPassword) {
            if (newPassword != cPassword) {
                return setShowAlert(true);
            } else if (password != session!.user.password) {
                return setShowAlert(true);

            } else {
                try {
                    const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/user`, {
                        id: userId, name: name, email: email, password: newPassword, gender: gender, tel: tel, lastname: lastname, username: username
                    })
                    console.log('res paa', res.data.user)
                    return await update(res.data.user);
                } catch (err) {
                    return setShowAlert(true);
                }
            }
        }

        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/user`, {
                id: userId, name: name, email: email, gender: gender, tel: tel, lastname: lastname
            })
            return await update(res.data.res);
        } catch (err) {
            return setShowAlert(true);
        }
    }

    return (
        <Side>
            {
                session && (
                    <div className="flex mt-10 text-xl flex-col flex-wrap ">
                        <div className="flex items-start justify-evenly flex-wrap">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>โปรไฟล์</CardTitle>
                                </CardHeader>
                                <CardContent className="flex lg:justify-center xl:justify-between flex-wrap items-center justify-center">
                                    <div className="w-full xl:w-1/3">
                                        <Dialog open={showDialogUpload} onOpenChange={(isOpen) => handleDialogClose(isOpen, 1)}>
                                            <DialogTrigger asChild className="flex w-full justify-center items-center mb-5">
                                                <Avatar className=" w-full h-full overflow-hidden mr-2 cursor-pointer">
                                                    <AvatarImage className="rounded-full object-cover w-[350px] h-[350px]"
                                                        src={process.env.NEXT_PUBLIC_BASE_PATH + '/' + session.user.image}
                                                    />
                                                </Avatar>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md bg-white ab absolute">
                                                <DialogHeader>
                                                    <DialogTitle>เปลี่ยนณุปโปรไฟล์</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex justify-center">
                                                    <Label htmlFor="picture">
                                                        <Avatar className="w-full h-full  overflow-hidden mr-2 cursor-pointer">
                                                            <AvatarImage className="rounded-full object-cover  w-[350px] h-[350px]" src={previewImage || process.env.NEXT_PUBLIC_BASE_PATH + '/' + session.user.image} />
                                                        </Avatar>
                                                    </Label>
                                                    <Input
                                                        id="picture"
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) => handleProfileImageChange(e)}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            onClick={() => uploadImg()}
                                                            variant={'ghost'}
                                                            className="bg-blue-500 text-white"
                                                        >
                                                            <FaFloppyDisk className="mr-2" />
                                                            Save
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>

                                            {/* Alert Dialog for Warning */}
                                            {showAlert && (
                                                <Dialog open={showAlert} onOpenChange={setShowAlert}>
                                                    <DialogContent className="sm:max-w-md bg-white">
                                                        <DialogHeader>
                                                            <DialogTitle>Warning</DialogTitle>
                                                            <DialogDescription>
                                                                {cPassword == '' || newPassword == '' || password == '' && changeP == true ? 'กรุณากรอกรหัสผ่านให้ถูกต้อง' : 'กรุณากรอกข้อมูลให้ครบ'}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="sm:justify-start">
                                                            <DialogClose asChild>
                                                                <Button type="button" onClick={() => setShowAlert(false)} variant="secondary">
                                                                    Close
                                                                </Button>
                                                            </DialogClose>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </Dialog>
                                    </div>

                                    <div className="flex justify-start items-start ml-0 lg:ml-4 xl:ml-4 lg:flex-grow xl:flex-grow ">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between"><b className="mr-1">ชื่อ-สกุล</b><b>:</b></div>
                                            <div className="flex justify-between"><b className="mr-1">E-mail</b><b>:</b></div>
                                            <div className="flex justify-between"><b className="mr-1">เพศ</b><b>:</b></div>
                                            <div className="flex justify-between"><b className="mr-1">สถานะ</b><b>:</b></div>
                                        </div>
                                        <div className="flex justify-start flex-col">
                                            <div className="ml-1">
                                                {session?.user.name + ' ' + session?.user.lastname}
                                            </div>
                                            <div className="ml-1">{session?.user.email}</div>
                                            <div className="ml-1">{session?.user.gender}</div>
                                            <div className="ml-1">{session?.user.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex items-end justify-end">
                                    <Dialog open={showDialogEdit} onOpenChange={(isOpen) => handleDialogClose(isOpen, 2)}>
                                        <DialogTrigger asChild>
                                            <Button variant={'secondary'} className="mr-2 bg-yellow-400">
                                                <FaEdit className="mr-2" />แก้ไข
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="xl:max-w-2xl bg-white ab absolute">
                                            <DialogHeader>
                                                <DialogTitle>แก้ไข โปรไฟล์</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="title" className="text-right">
                                                        ชื่อ<sup className="text-red-500 ">*</sup>
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="col-span-3"
                                                        placeholder="Type your Title here."
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="title" className="text-right">
                                                        นามสกุล<sup className="text-red-500 ">*</sup>
                                                    </Label>
                                                    <Input
                                                        id="lastname"
                                                        value={lastname}
                                                        onChange={(e) => setLastname(e.target.value)}
                                                        className="col-span-3"
                                                        placeholder="Type your Title here."
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="title" className="text-right">
                                                        เบอร์โทรศัพท์<sup className="text-red-500 ">*</sup>
                                                    </Label>
                                                    <Input
                                                        id="tel"
                                                        value={tel}
                                                        onChange={(e) => setTel(e.target.value)}
                                                        className="col-span-3"
                                                        placeholder="Type your Title here."
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="content" className="text-right">
                                                        E-mail<sup className="text-red-500 ">*</sup>
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="col-span-3"
                                                        placeholder="Type your Title here."
                                                        autoComplete="off"

                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <span></span>
                                                    <div className="flex items-center space-x-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" >{gender == '' ? 'เพศ' : gender}</Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-56">
                                                                <DropdownMenuLabel>เพศ</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuRadioGroup value={gender} onValueChange={setGender}>
                                                                    <DropdownMenuRadioItem value="ชาย">ชาย</DropdownMenuRadioItem>
                                                                    <DropdownMenuRadioItem value="หญิง">หญิง</DropdownMenuRadioItem>
                                                                </DropdownMenuRadioGroup>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <span></span>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={changeP}
                                                            onCheckedChange={(checked) => setChangeP(checked as boolean)}
                                                            id="published"
                                                            className="border border-slate-100 checked:border-slate-100 focus:border-slate-100"
                                                        />
                                                        <Label htmlFor="published" className="text-left">
                                                            เปลี่ยนรหัสผ่าน และ ชื่อผู้ใ้ช
                                                        </Label>
                                                    </div>
                                                </div>
                                                <div className={`flex flex-col  ${!changeP ? 'hidden' : ''}`}>
                                                    <div className="grid grid-cols-4 items-center gap-4 mb-2">
                                                        <Label htmlFor="content" className="text-right">
                                                            ชื่อผู้ใช้<sup className="text-red-500 ">*</sup>
                                                        </Label>
                                                        <Input
                                                            id="username"
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                            className="col-span-3"
                                                            placeholder="Type your Old Password."
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className={`flex flex-col  ${!changeP ? 'hidden' : ''}`}>
                                                    <div className="grid grid-cols-4 items-center gap-4 mb-2">
                                                        <Label htmlFor="content" className="text-right">
                                                            รหัสผ่านเก่า<sup className="text-red-500 ">*</sup>
                                                        </Label>
                                                        <Input
                                                            id="oPassword"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="col-span-3"
                                                            placeholder="Type your Old Password."
                                                            type="password"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4 mb-2">
                                                        <Label htmlFor="content" className="text-right">
                                                            รหัสผ่านใหม่<sup className="text-red-500 ">*</sup>
                                                        </Label>
                                                        <Input
                                                            id="nPassword"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            className="col-span-3"
                                                            placeholder="Type your New Password."
                                                            type="password"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4 mb-2">
                                                        <Label htmlFor="content" className="text-right">
                                                            กรอกรหัสผ่านใหม่อีกครั้ง<sup className="text-red-500 ">*</sup> Password
                                                        </Label>
                                                        <Input
                                                            id="cPassword"
                                                            value={cPassword}
                                                            onChange={(e) => setCPassword(e.target.value)}
                                                            className="col-span-3"
                                                            placeholder="Confirm your New Password."
                                                            type="password"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button
                                                        type="button"
                                                        onClick={() => submit(Number(session?.user.id))}
                                                        className="bg-blue-500 text-white"
                                                        variant={'ghost'}
                                                    >
                                                        <FaFloppyDisk className="mr-2" />
                                                        บันทึก
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>

                                        {/* Alert Dialog for Warning */}
                                        {showAlert && (
                                            <Dialog open={showAlert} onOpenChange={setShowAlert}>
                                                <DialogContent className="sm:max-w-md bg-white">
                                                    <DialogHeader>
                                                        <DialogTitle>Warning</DialogTitle>
                                                        <DialogDescription>
                                                            {cPassword == '' || newPassword == '' || password == '' && changeP == true ? 'กรุณากรอกรหัสผ่านให้ถูกต้อง' : 'กรุณากรอกข้อมูลให้ครบ'}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="sm:justify-start">
                                                        <DialogClose asChild>
                                                            <Button type="button" onClick={() => setShowAlert(false)} variant="secondary">
                                                                Close
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )
            }
        </Side>

    );
}