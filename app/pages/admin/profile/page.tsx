'use client'
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { FaFloppyDisk } from "react-icons/fa6";
import React, { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import axios, { AxiosResponse } from "axios";
import { CustomUserSession } from "@/app/interfaces/user";
import Side from "@/app/components/side/side";
import { User } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


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
    const [users, setUsers] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(users.map(() => false));
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        gender: "",
        tel: "",
        role: "user",
    });
    const isFormComplete = Object.values(formData).every((value) => value.trim() !== "");


    const resetForm = () => {
        setFormData({
            name: "",
            lastname: "",
            email: "",
            username: "",
            password: "",
            gender: "",
            tel: "",
            role: "user",
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async () => {
        try {
            const res = await axios.post(`/api/user`, formData);
            alert("เพิ่มผู้ใช้สำเร็จ!");
            resetForm();
            setIsAddUserOpen(false);
            fetchUser();
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
        }
    };


    const handleOpenChangeSet = (index: any, open: any) => {
        const newIsOpen = [...isOpen];
        newIsOpen[index] = open;
        setIsOpen(newIsOpen);
    };

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

    const deleteUser = async (id: number) => {
        try {
            const res = await axios.delete(`/api/user?id=${id}`)
            fetchUser();
            console.log(res.data.res)
        } catch (error) {

        }
    }
    const uploadImg = async () => {
        try {
            const formData = new FormData();
            formData.append("image", uploadImage!);
            if (session) formData.append("id", session.user.id.toString());

            const res = await axios.put(`/api/user/upload`, formData, {
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
                console.log('newPassword != cPassword')
                return setShowAlert(true);
            } else {
                try {
                    const res = await axios.put(`/api/user`, {
                        id: userId, name: name, email: email, password: newPassword, gender: gender,
                        tel: tel, lastname: lastname, username: username, oldPassword: password
                    })
                    if (res.data.status == 401) {
                        return setShowAlert(true);
                    }
                    if (res.data.status == 200) {
                        alert('อัปเดตสําเร็จ');
                    }
                    console.log('res paa', res.data.user)
                    return await update(res.data.user);
                } catch (err) {
                    return setShowAlert(true);
                }
            }
        }

        try {
            const res = await axios.put(`/api/user`, {
                id: userId, name: name, email: email, gender: gender, tel: tel, lastname: lastname
            })
            return await update(res.data.res);
        } catch (err) {
            return setShowAlert(true);
        }
    }

    const fetchUser = async () => {
        try {
            const res = await axios.get(`/api/user`);
            console.log('user aacount ---->', res.data.res);
            setUsers(res.data.res);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (session?.user.role == "admin") {
            fetchUser();
        }
    }, [session])

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
                                                        src={'http://172.20.48.135:9000/images' + '/profile/' + session.user.image}
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
                                                            <AvatarImage className="rounded-full object-cover  w-[350px] h-[350px]" src={previewImage || 'http://172.20.48.135:9000/images' + '/profile/' + session.user.image} />
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
                                                            เปลี่ยนรหัสผ่าน และ ชื่อผู้ใช้
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
            {
                session && session.user.role == "admin" && (
                    <Card className="mt-4">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-start flex-wrap">
                                <CardTitle className="mr-2">ผู้ใช้ทั้งหมด</CardTitle>
                                <Dialog
                                    open={isAddUserOpen}
                                    onOpenChange={(open) => {
                                        setIsAddUserOpen(open);
                                        if (!open) resetForm();
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => setIsAddUserOpen(true)}
                                            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                                        >
                                            เพิ่มผู้ใช้
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md rounded-lg p-6 shadow-lg bg-white space-y-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-bold text-gray-800">
                                                เพิ่มผู้ใช้ใหม่
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                    ชื่อ
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    placeholder="ชื่อ"
                                                    className="input w-full border rounded px-4 py-2"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                                    นามสกุล
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastname"
                                                    name="lastname"
                                                    placeholder="นามสกุล"
                                                    className="input w-full border rounded px-4 py-2"
                                                    value={formData.lastname}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    อีเมล
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    placeholder="อีเมล"
                                                    className="input w-full border rounded px-4 py-2"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                    ชื่อผู้ใช้
                                                </label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    placeholder="ชื่อผู้ใช้"
                                                    className="input w-full border rounded px-4 py-2"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                    รหัสผ่าน
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    placeholder="รหัสผ่าน"
                                                    className="input w-full border rounded px-4 py-2"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                                    เพศ
                                                </label>
                                                <select
                                                    id="gender"
                                                    name="gender"
                                                    className="select w-full border rounded px-4 py-2"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="ชาย">ชาย</option>
                                                    <option value="หญิง">หญิง</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                                                    เบอร์โทรศัพท์
                                                </label>
                                                <input
                                                    type="text"
                                                    id="tel"
                                                    name="tel"
                                                    placeholder="เบอร์โทรศัพท์"
                                                    className="input w-full border rounded px-4 py-2"
                                                    value={formData.tel}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d{0,10}$/.test(value)) {
                                                            setFormData({ ...formData, tel: value });
                                                        }
                                                    }}
                                                    inputMode="numeric" // แนะนำให้ใช้งาน inputMode เพื่อแสดงแป้นพิมพ์ตัวเลขในมือถือ
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                                    ตำแหน่ง
                                                </label>
                                                <select
                                                    id="role"
                                                    name="role"
                                                    className="select w-full border rounded px-4 py-2"
                                                    value={formData.role}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                        <DialogFooter className="flex justify-end space-x-4">
                                            <Button
                                                className={`bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded ${isFormComplete ? "" : "opacity-50 cursor-not-allowed"
                                                    }`}
                                                onClick={handleAddUser}
                                                disabled={!isFormComplete} // ปิดการทำงานปุ่มถ้า form ไม่ครบ
                                            >
                                                ยืนยัน
                                            </Button>
                                            <Button
                                                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                                onClick={() => { setIsAddUserOpen(false); resetForm(); }}
                                            >
                                                ยกเลิก
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>ชื่อ</TableHead>
                                        <TableHead>นามสกุล</TableHead>
                                        <TableHead>เบอร์โทรศัพท์</TableHead>
                                        <TableHead>สถานะ</TableHead>
                                        <TableHead>ดำเนินการ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length > 0 ? (
                                        users.map((user, i) => (
                                            <TableRow key={user.id} className={`${user.id == session.user.id ? 'bg-blue-600 text-white hover:text-black' : ''}`}>
                                                <TableCell className="font-medium">{i + 1}</TableCell>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell className="font-medium">{user.lastname}</TableCell>
                                                <TableCell className="font-medium">{user.tel}</TableCell>
                                                <TableCell className="font-medium">{user.role}</TableCell>
                                                <TableCell className="font-medium">
                                                    <Dialog open={isOpen[i]}
                                                        onOpenChange={(open) => {
                                                            handleOpenChangeSet(i, open)
                                                        }}>
                                                        <DialogTrigger asChild>
                                                            <Button className={`${user.id == session.user.id ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'bg-red-500 hover:bg-red-800'}`} >ลบ</Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle>ต้องการลบผู้ใช้ {user.name} จริงหรือไม่</DialogTitle>
                                                                <DialogDescription>
                                                                    ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter className="sm:justify-start">
                                                                <DialogClose asChild>
                                                                    <div className="flex gap-2">
                                                                        <Button type="button" variant="destructive" onClick={() => deleteUser(user.id)}>
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
                                    ) : (
                                        <TableRow >
                                            <TableCell colSpan={3} className="h-24 text-center">ไม่มีข้อมูล</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )
            }
        </Side>
    );
}