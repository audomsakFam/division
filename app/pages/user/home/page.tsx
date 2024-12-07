'use client'
import { ResItemsGroup } from "@/app/interfaces/item";
import { GetItemWithCache } from "@/lib/servers/getItemWithCache";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CalendarCom from "@/app/components/calendar/calendar";

export default function HomePage() {
    const [items, setItems] = useState<ResItemsGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDivision, setSelectedDivision] = useState("ทั้งหมด");

    useEffect(() => {
<<<<<<< HEAD
        GetItemWithCache().then((res) => { setItems(res); setLoading(false) });
    }, [])
    if (loading) return <div>Loading...</div>

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDivision === "ทั้งหมด" || item.divisionName === selectedDivision)
=======
        console.log("test")
        GetItemWithCache().then((res) => {setItems(res); console.log("hello123")});
    
    }, [])
    
    return (
        <div  className="h-screen overflow-auto"> 
            <Card className="w-full m-2">
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table className="overflow-hidden">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">name</TableHead>
                                <TableHead>img</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((v,i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{v.name}</TableCell>
                                    <TableCell>
                                        {
                                            v.img ? <img src={v.img} alt="img" className="w-[100px]"/> : 'no img'
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </div>
>>>>>>> famDev
    );

    const groupedByDivision = filteredItems.reduce((acc, item) => {
        const { divisionName } = item;
        if (!acc[divisionName]) {
            acc[divisionName] = [];
        }
        acc[divisionName].push(item);
        return acc;
    }, {} as Record<string, ResItemsGroup[]>);

    const divisionNames = ["เลือกหมวดหมู่วัสดุ - อุปกรณ์", ...Array.from(new Set(items.map(item => item.divisionName)))];

    return (
        <>
            {/* Left Banner */}
            <div id="left-banner" style={{ position: 'fixed', top: '50%', left: '30px', transform: 'translateY(-50%)', width: '150px', height: '500px', backgroundImage: 'url(/images/banner.jpg)', backgroundSize: 'cover', zIndex: 1000 }}>
                <button
                    onClick={() => {
                        const leftBanner = document.querySelector('#left-banner'); if (leftBanner instanceof HTMLElement) { leftBanner.remove(); }
                    }}
                    style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'red', color: 'white', borderRadius: '50%' }}
                >
                    &times;
                </button>
            </div>

            {/* Right Banner */}
            <div id="right-banner" style={{ position: 'fixed', top: '50%', right: '30px', transform: 'translateY(-50%)', width: '150px', height: '500px', backgroundImage: 'url(/images/banner.jpg)', backgroundSize: 'cover', zIndex: 1000 }}>
                <button
                    onClick={() => {
                        const rightBanner = document.querySelector('#right-banner'); if (rightBanner instanceof HTMLElement) { rightBanner.remove(); }
                    }}
                    style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'red', color: 'white', borderRadius: '50%' }}
                >
                    &times;
                </button>
            </div>

            <div className="flex justify-center items-center w-full h-full mt-10">
                <div className="overflow-auto w-[70%] flex flex-col items-center">
                    <CalendarCom />
                    <Card className="w-full m-2">
                        <CardHeader>
                            <CardTitle className="text-center">รายชื่อวัสดุ - อุปกรณ์</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full mb-4 flex justify-center">
                                <input
                                    type="text"
                                    placeholder="ค้นหาวัสดุ - อุปกรณ์..."
                                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="w-full mb-4 flex justify-center">
                                <select
                                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                    value={selectedDivision}
                                    onChange={(e) => setSelectedDivision(e.target.value)}
                                >
                                    {divisionNames.map((division, index) => (
                                        <option key={index} value={division}>{division}</option>
                                    ))}
                                </select>
                            </div>
                            <Table className="overflow-hidden">
                                <TableHeader>
                                    <TableRow className="border-b border-t border-l border-r border-gray-800">
                                        <TableHead className="text-stone-950 border-r border-gray-400 text-center w-1/2">อุปกรณ์</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-400 text-center">ภาพประกอบ</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-400 text-center">
                                            <div className="text-stone-950 mb-2 border-b border-gray-400">จำนวน</div>
                                            <div className="flex justify-around">
                                                <div className="text-stone-950 border-r border-gray-400 flex items-center justify-center w-full mr-2 pr-2">ทั้งหมด</div>
                                                <div className="text-stone-950 flex items-center justify-center w-full">เหลือ</div>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center text-stone-950 border-r border-gray-400">
                                            <div className="mb-2 border-b border-gray-400 text-center pl-16 pr-16">สถานะ</div>
                                            <div className="flex justify-around text-center">
                                                <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">ปกติ</div>
                                                <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">ถูกยืม</div>
                                                <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">ชำรุด</div>
                                                <div className="text-center text-stone-950 flex items-center justify-center w-full">หาย</div>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-400 text-center">หน่วย</TableHead>
                                        <TableHead className="text-stone-950 text-center">เลือกจำนวน</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="border-b border-t border-l border-r border-gray-800">
                                    {groupedByDivision && Object.entries(groupedByDivision).map(([divisionName, items]) => (
                                        <>
                                            <TableRow key={divisionName} className="bg-gray-200">
                                                <TableCell colSpan={7} className="text-stone-950 text-left font-bold">{divisionName}</TableCell>
                                            </TableRow>
                                            {items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-stone-950 border-r border-gray-400 text-left">{item.name}</TableCell>
                                                    <TableCell className="text-stone-950 border-r border-gray-400 text-center">
                                                        <img src={item.img} alt={item.name} className="h-12 w-12 object-cover" />
                                                    </TableCell>
                                                    <TableCell className="text-stone-950 mb-2 border-r border-gray-400">
                                                        <div className="flex justify-around">
                                                            <div className="text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">{item.statusCounts.map((statusCount) => statusCount.count).reduce((a, b) => a + b, 0)}</div>
                                                            <div className="text-stone-950 flex items-center justify-center w-full">{item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="mb-2 border-r border-gray-400 text-center">
                                                        <div className="flex justify-around text-center">
                                                            <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">
                                                                {item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0}</div>
                                                            <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">
                                                                {item.statusCounts.find(v => v.status === 'ถูกยืม')?.count ?? 0}
                                                            </div>
                                                            <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">
                                                                {item.statusCounts.find(v => v.status === 'ชำรุด')?.count ?? 0}
                                                            </div>
                                                            <div className="text-center text-stone-950 flex items-center justify-center w-full">
                                                                {item.statusCounts.find(v => v.status === 'หาย')?.count ?? 0}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-stone-950 border-r border-gray-400 text-center">{item.postfixName}</TableCell>
                                                    <TableCell className="text-stone-950 text-center">
                                                        <input
                                                            type="number"
                                                            className="w-16 px-2 py-1 border border-gray-400 rounded"
                                                            max={item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0}
                                                            min={0}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                const maxValue = item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0;

                                                                if (value > maxValue) {
                                                                    e.target.value = maxValue.toString();
                                                                } else if (value < 0) {
                                                                    e.target.value = "0";
                                                                }
                                                            }}
                                                        />

                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <button
                    onClick={() => window.location.href = "/pages/user/profile"}
                    className="w-24 px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                    ต่อไป
                </button>
            </div>
        </>
    );
}
