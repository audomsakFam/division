'use client';

import CalendarCom from "@/app/components/calendar/calendar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
    const route = useRouter()
    useEffect(() => {
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

        // Adjust on window resize
        window.addEventListener("resize", adjustBannerStyles);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("resize", adjustBannerStyles);
        };
    }, []);

    return (
        <>
            {/* Left Banner */}
            <div
                id="left-banner"
                style={{
                    position: "fixed",
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: "500px",
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH}/images/banner.jpg)`,
                    backgroundSize: "cover",
                    zIndex: 1000,
                }}
            >
                <button
                    onClick={() => {
                        const leftBanner = document.querySelector("#left-banner");
                        if (leftBanner instanceof HTMLElement) {
                            leftBanner.remove();
                        }
                    }}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                    }}
                >
                    &times;
                </button>
            </div>

            {/* Right Banner */}
            <div
                id="right-banner"
                style={{
                    position: "fixed",
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: "500px",
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH}/images/banner.jpg)`,
                    backgroundSize: "cover",
                    zIndex: 1000,
                }}
            >
                <button
                    onClick={() => {
                        const rightBanner = document.querySelector("#right-banner");
                        if (rightBanner instanceof HTMLElement) {
                            rightBanner.remove();
                        }
                    }}
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                    }}
                >
                    &times;
                </button>
            </div>

            <div className="flex justify-center items-center w-full h-full mt-2 ml-0 mr-2 pl-2 pr-2">
                <div className="overflow-auto w-[800px] flex flex-col items-center">
                    <div className="bg-blue-900 pt-3 pb-3 pl-2 pr-2 mb-4 shadow-md w-[100%]">
                        <h1 className="text-center text-lg sm:text-3xl font-bold text-white">
                            ยินดีต้อนรับเขาสู่ ระบบยืม - คืน <br /> วัสดุ - อุปกรณ์ กองพัฒนานักศึกษา
                        </h1>
                    </div>
                    <div className="w-full mb-4">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/c0xVqCbYCuc"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full max-w-4xl h-64 md:h-96"
                        ></iframe>
                    </div>

                    <div className="mb-4 mt-10 text-center text-2xl font-bold text-gray-800 ">
                        <h1>ปฏิทนการยืม</h1>
                    </div>

                    <CalendarCom />
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <button
                    onClick={() => route.push("/pages/user/main_flow")}
                    className="w-32 px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                    ยืมอุปกรณ์
                </button>
            </div>
        </>
    );
}
