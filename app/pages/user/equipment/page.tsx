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
import Link from "next/link";
export default function Equipment() {
    const [items, setItems] = useState<ResItemsGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDivision, setSelectedDivision] = useState("ทั้งหมด");
    const [selectAllState, setSelectAllState] = useState<Record<string, boolean>>({});

    useEffect(() => {
        GetItemWithCache().then((res) => { setItems(res); setLoading(false) });
    }, [])
    if (loading) return <div>Loading...</div>

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDivision === "เลือกหมวดหมู่วัสดุ - อุปกรณ์ (ทั้งหมด)" || selectedDivision === "ทั้งหมด" || item.divisionName === selectedDivision)
    );

    const divisionNames = ["เลือกหมวดหมู่วัสดุ - อุปกรณ์ (ทั้งหมด)", ...Array.from(new Set(items.map(item => item.divisionName)))];

    const groupedByDivision = filteredItems.reduce((acc, item) => {
        const { divisionName } = item;
        if (!acc[divisionName]) {
            acc[divisionName] = [];
        }
        acc[divisionName].push(item);
        return acc;
    }, {} as Record<string, ResItemsGroup[]>);

    const handleSelectAll = (divisionName: string) => {
        setSelectAllState(prevState => ({
            ...prevState,
            [divisionName]: !prevState[divisionName],
        }));

        const isSelectAll = !selectAllState[divisionName];
        if (isSelectAll) {
            groupedByDivision[divisionName]?.forEach(item => {
                const maxCount = item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0;
                const inputElement = document.querySelector(`input[data-division='${divisionName}'][data-item='${item.name}']`) as HTMLInputElement;
                if (inputElement) inputElement.value = maxCount.toString();
            });
        } else {
            groupedByDivision[divisionName]?.forEach(item => {
                const inputElement = document.querySelector(`input[data-division='${divisionName}'][data-item='${item.name}']`) as HTMLInputElement;
                if (inputElement) inputElement.value = "0";
            });
        }
    };

    return (
        <>
            <div className="flex justify-center items-center w-full h-full mt-2">
                <div className="overflow-auto w-[900px] flex flex-col items-center">
                    <Card className="w-full p-0">
                        <CardHeader>
                            <CardTitle className="text-center">รายชื่อวัสดุ - อุปกรณ์</CardTitle>
                        </CardHeader>
                        <CardContent className=" p-1">
                            <div className="w-full mb-4 flex justify-center p-0">
                                <input
                                    type="text"
                                    placeholder="ค้นหาวัสดุ - อุปกรณ์..."
                                    className="w-[300px] px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="w-full mb-4 flex justify-center">
                                <select
                                    className="sm:w-[320px] w-[300px] px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
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
                                        <TableHead className="text-stone-950 border-r border-gray-400 text-center w-[1000px]">อุปกรณ์</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-400 text-center">ภาพประกอบ</TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-400 text-center">
                                            <div className="text-stone-950 mb-2 border-b border-gray-400">จำนวน</div>
                                            <div className="flex justify-around">
                                                <div className="text-stone-950 border-r border-gray-400 flex items-center justify-center w-full mr-2 pr-2">ทั้งหมด</div>
                                                <div className="text-stone-950 flex items-center justify-center w-full">เหลือ</div>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center text-stone-950 border-r border-gray-400">
                                            <div className="mb-2 border-b border-gray-400 text-center pl-[50px] pr-[50px]">สถานะ</div>
                                            <div className="flex justify-around text-center">
                                                <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">ปกติ</div>
                                                <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">ถูกยืม</div>
                                                <div className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">ชำรุด</div>
                                                <div className="text-center text-stone-950 flex items-center justify-center w-[full]">หาย</div>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-stone-950 border-r border-gray-400 text-center w-[10px]">หน่วย</TableHead>
                                        <TableHead className="text-stone-950 text-center w[8px]">เลือกจำนวน</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="border-b border-t border-l border-r border-gray-800">
                                    {groupedByDivision && Object.entries(groupedByDivision).map(([divisionName, items]) => (
                                        <>
                                            <TableRow key={divisionName} className="bg-gray-200">
                                                <TableCell colSpan={7} className="text-stone-950 font-bold">
                                                    <div className="flex justify-between items-center">
                                                        <span>{divisionName}</span>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectAllState[divisionName] || false}
                                                                onChange={() => handleSelectAll(divisionName)}
                                                                className="ml-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                            <span className="ml-2">เลือกทั้งหมด</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                            {items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="pt-0 pb-0 text-stone-950 border-r border-gray-400 text-left">{item.name}</TableCell>
                                                    <TableCell className="pt-0 pb-0 pl-0 pr-0 text-stone-950 border-r border-gray-400 text-center">
                                                        <div className="relative group flex justify-center items-center">
                                                            <img
                                                                src={item.img}
                                                                alt={item.name}
                                                                className="h-12 w-[auto] object-cover transition-transform duration-300 ease-in-out sm:group-hover:scale-[7] group-hover:scale-[3] group-hover:z-50 group-hover:absolute group-hover:top-1/2 group-hover:left-1/2 group-hover:transform group-hover:-translate-x-1/2 group-hover:-translate-y-1/2"
                                                            />
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="pt-0 pb-0 text-stone-950 mb-2 border-r border-gray-400">
                                                        <div className="flex justify-around">
                                                            <div className="text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">{item.statusCounts.map((statusCount) => statusCount.count).reduce((a, b) => a + b, 0)}</div>
                                                            <div className="text-stone-950 flex items-center justify-center w-full">{item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pt-0 pb-0 mb-2 border-r border-gray-400 text-center">
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
                                                    <TableCell className="pt-0 pb-0 text-stone-950 border-r border-gray-400 text-center">{item.postfixName}</TableCell>
                                                    <TableCell className="pt-0 pb-0 text-stone-950 text-center">
                                                        {/* <input
                                                            type="number"
                                                            className="w-16 px-2 py-1 border border-gray-400 rounded"
                                                            max={item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0}
                                                            min={0}
                                                            defaultValue={0}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                const maxValue = item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0;

                                                                if (value > maxValue) {
                                                                    e.target.value = maxValue.toString();
                                                                } else if (value < 0) {
                                                                    e.target.value = "0";
                                                                }
                                                            }}
                                                        /> */}
                                                        <input
                                                            type="number"
                                                            data-division={divisionName}
                                                            data-item={item.name}
                                                            className="w-16 px-2 py-1 border border-gray-400 rounded"
                                                            max={item.statusCounts.find(v => v.status === 'ปกติ')?.count ?? 0}
                                                            min={0}
                                                            defaultValue={0}
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
            <div className="mt-6 mb-6 flex justify-center space-x-4">
                <Link href="/pages/user/home">
                    <button
                        type="button"
                        className="w-[100px] bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                    >
                        ย้อนกลับ
                    </button>
                </Link>
                <Link href="/pages/user/profile">
                    <button
                        type="button"
                        className="w-[100px] bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        ถัดไป
                    </button>
                </Link>
            </div>
        </>
    )
}