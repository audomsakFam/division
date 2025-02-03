'use client';

import CalendarCom from "@/app/components/calendar/calendar";
import { PerviewData, ResPerview } from "@/app/interfaces/preview";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from 'react-player'
export default function HomePage() {
    const route = useRouter()
    const [previewData, setPerviewData] = useState<PerviewData[]>([]);
    useEffect(() => {

        const fetchPerview = async () => {
            try {
                const res = await axios.get<ResPerview>(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/preview`);
                setPerviewData(res.data.res);
            } catch (error) {
                console.log(error);
            }
        }
        const adjustBannerStyles = () => {
            const leftBanner = document.getElementById("left-banner");
            const rightBanner = document.getElementById("right-banner");
            const screenWidth = window.innerWidth;

            if (leftBanner instanceof HTMLElement) {
                if (screenWidth < 768) {
                    leftBanner.style.left = "20px";
                    leftBanner.style.width = "100px";
                } else {
                    leftBanner.style.left = "30px";
                    leftBanner.style.width = "150px";
                }
            }

            if (rightBanner instanceof HTMLElement) {
                if (screenWidth < 768) {
                    rightBanner.style.right = "20px";
                    rightBanner.style.width = "100px";
                } else {
                    rightBanner.style.right = "30px";
                    rightBanner.style.width = "150px";
                }
            }
        };

        // Initial adjustment
        adjustBannerStyles();
        fetchPerview();
        // Adjust on window resize
        window.addEventListener("resize", adjustBannerStyles);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("resize", adjustBannerStyles);
        };
    }, []);

    return (
        <>
            {
                previewData.map((item) => (
                    <>
                        {
                            (item.type == 0 && (
                                <div id="bannerL" className="fixed flex justify-start w-1/2 left-0 top-1/4 ml-10 z-[1000]">
                                    <img
                                        src={'http://localhost:9000/images/' + item.name}
                                        className="h-[500px] object-cover"
                                        alt=""
                                    />
                                    <button
                                        onClick={() => {
                                            const leftBanner = document.querySelector("#bannerL");
                                            if (leftBanner instanceof HTMLElement) {
                                                leftBanner.remove();
                                            }
                                        }}
                                        className="absolute left-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                                    >
                                        &times;
                                    </button>
                                </div>

                            ))
                        }
                        {
                            (item.type == 1 && (
                                <div id="bannerR" className="fixed flex justify-end w-1/2 right-0 top-1/4 mr-10 z-[1000]">
                                    <img
                                        src={'http://localhost:9000/images/' + item.name}
                                        className="h-[500px] object-cover"
                                        alt=""
                                    />
                                    <button
                                        onClick={() => {
                                            const rightBanner = document.querySelector("#bannerR");
                                            if (rightBanner instanceof HTMLElement) {
                                                rightBanner.remove();
                                            }
                                        }}
                                        className="absolute right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                                    >
                                        &times;
                                    </button>
                                </div>

                            ))
                        }
                        {
                            item.type == 2 && (

                                <div className="absolute flex justify-center items-center h-screen mt-2 ml-0 mr-2 pl-2 pr-2 flex-col top-1/3  z-[1002]">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-900 pt-3 pb-3 pl-2 pr-2 mb-4 shadow-md w-[100%]">
                                            <h1 className="text-center text-lg sm:text-3xl font-bold text-white">
                                                ยินดีต้อนรับเข้าสู่ ระบบยืม - คืน <br /> วัสดุ - อุปกรณ์ กองพัฒนานักศึกษา
                                            </h1>
                                        </div>

                                        <div className="w-full mb-4 flex items-center justify-center">
                                            <ReactPlayer url={'http://localhost:9000/images/' + item.name} controls={true} />
                                        </div>

                                        <div className="mb-4 mt-10 text-center text-2xl font-bold text-gray-800 ">
                                            <h1>ปฏิทินการยืม</h1>
                                        </div>
                                        <CalendarCom />
                                    </div>
                                    <div className="flex justify-center ">
                                        <button
                                            onClick={() => route.push("/pages/user/main_flow")}
                                            className="w-32 px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                        >
                                            ยืมอุปกรณ์
                                        </button>
                                    </div>
                                    <p className="text-white">___</p>
                                </div>
                            )
                        }
                    </>
                ))
            }
        </>
    );
}
