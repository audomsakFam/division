'use client'
import Side from "@/app/components/side/side";
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
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
export default function Management() {
    const [previewData, setPerviewData] = useState<PerviewData[]>([]);
    const [fileL, setFileL] = useState<File | null>(null);
    const [previewUrlL, setPreviewUrlL] = useState<string | null>(null);
    const [fileR, setFileR] = useState<File | null>(null);
    const [previewUrlR, setPreviewUrlR] = useState<string | null>(null);
    const [fileVideo, setFileVideo] = useState<File | null>(null);


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

        fetchPerview();
    }, [])
    return (
        <Side>
            <div className="flex justify-between flex-wrap">

                <Card className="w-full sm:w-full lg:w-full xl:w-1/3 mr-2 mb-2">
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
                <Card className="flex-grow">
                    <CardHeader>
                        <CardTitle>วิดีโอ</CardTitle>
                        <CardDescription>วิดีโอที่ Home Page</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[460px] flex items-center justify-center">
                        <div className="flex justify-around">
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
                    <CardFooter className="flex justify-end">
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
                                        accept="image/*"
                                        onChange={handleFileVideo}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </Side>
    );
}