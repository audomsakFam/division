'use client'
import { ResItemsGroup } from "@/app/interfaces/item";
import { ClearItemCache, GetItemWithCache } from "@/lib/servers/getItemWithCache";
import { useState, useEffect } from "react";

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
import { useRouter } from "next/navigation";

interface ReqBorrowItem {
    setId?: number
    set?: Set
    itemName?: string
    value?: number
    division: string
}

export interface Set {
    Item_set: ItemSet[]
}

export interface ItemSet {
    itemName: string
    value: number
}


export default function Equipment({ onSelected }: { onSelected: (item: ReqBorrowItem[]) => void }) {
    const route = useRouter()
    const [items, setItems] = useState<ResItemsGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDivision, setSelectedDivision] = useState("ทั้งหมด");
    const [selectAllState, setSelectAllState] = useState<Record<string, boolean>>({});
    const [expandedImage, setExpandedImage] = useState<string | null>(null); // เก็บสถานะของภาพที่ถูกขยาย
    const [inputValues, setInputValues] = useState<Record<string, Record<string, number>>>({});

    const handleImageClick = (imgPath: string) => {
        if (expandedImage === imgPath) {
            setExpandedImage(null); // ถ้าภาพเดิมถูกคลิกอีกครั้ง จะปิดการขยาย
        } else {
            setExpandedImage(imgPath); // บันทึก path ของภาพที่ถูกคลิก
        }
    };

    useEffect(() => {
        ClearItemCache();
        GetItemWithCache().then((res) => { setItems(res); setLoading(false) });
    }, [])

    if (loading) return <div>Loading...</div>

    const filteredItems = items.filter(item => {
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDivision = selectedDivision === "เลือกหมวดหมู่วัสดุ - อุปกรณ์ (ทั้งหมด)" || selectedDivision === "ทั้งหมด" || item.divisionName === selectedDivision;
        return matchesSearchTerm && matchesDivision;
    });

    const divisionNames = ["เลือกหมวดหมู่วัสดุ - อุปกรณ์ (ทั้งหมด)", ...Array.from(new Set(items.map(item => item.divisionName)))];

    const groupedByDivisionAndSet = filteredItems.reduce((acc, item) => {
        const { divisionName, itemSets } = item;

        if (!acc[divisionName]) {
            acc[divisionName] = {};
        }

        if (itemSets.length > 0) {
            itemSets.forEach(({ setName, setId }) => {
                if (!acc[divisionName][setName]) {
                    acc[divisionName][setName] = {
                        items: [],
                        setId, // เพิ่ม setId ในข้อมูลของกลุ่ม
                    };
                }

                acc[divisionName][setName].items.push(item);
            });
        } else {
            if (!acc[divisionName]["ไม่มีหมวดหมู่"]) {
                acc[divisionName]["ไม่มีหมวดหมู่"] = {
                    items: [],
                    setId: null, // กรณีไม่มี `setId`
                };
            }
            acc[divisionName]["ไม่มีหมวดหมู่"].items.push(item);
        }

        return acc;
    }, {} as Record<
        string,
        Record<string, { items: ResItemsGroup[]; setId: number | null }>
    >);


    const handleSelectAll = (divisionName: string, setName: string, setId?: number) => {
        const key = `${divisionName}-${setName}-${setId ?? 'null'}`;

        // Toggle the selection state and ensure it toggles the correct value
        setSelectAllState((prevState) => {
            const newState = { ...prevState, [key]: !(prevState[key] || false) };
            return newState;
        });

        setInputValues((prevValues) => {
            const updatedValues = { ...prevValues };
            const items = groupedByDivisionAndSet[divisionName]?.[setName]?.items || [];

            items.forEach((item) => {
                const maxCount = item.statusCounts
                    .filter((v) => v.status === "ปกติ")
                    .map((statusCount) => statusCount.count)
                    .reduce((a, b) => a + b, 0);

                if (!updatedValues[key]) {
                    updatedValues[key] = {};
                }

                updatedValues[key][item.name] = !selectAllState[key] ? maxCount : 0;
            });
            console.log("selected --=-===> ", updatedValues)

            return updatedValues;
        });
    };

    const handleInputChange = (divisionName: string, itemName: string, value: number) => {
        setInputValues((prevValues) => {
            const updatedValues = { ...prevValues };

            // If value is 0, remove the item from inputValues
            if (value === 0) {
                const divisionItems = updatedValues[divisionName] || {};
                delete divisionItems[itemName]; // Remove the item from the division
                updatedValues[divisionName] = divisionItems; // Reassign the updated division back
            } else {
                const existingDivision = updatedValues[divisionName] || {};
                updatedValues[divisionName] = {
                    ...existingDivision,
                    [itemName]: value, // Update the value if it's not 0
                };
            }
            console.log("selected one--=-===> ", updatedValues)

            return updatedValues;
        });
    };


    const transformInputValues = (
        inputValues: Record<string, Record<string, number>>
    ): ReqBorrowItem[] => {
        const result: ReqBorrowItem[] = [];

        Object.entries(inputValues).forEach(([divisionKey, items]) => {
            // Extract division name from the divisionKey
            const [divisionName, setName, setIdStr] = divisionKey.split("-");
            const setId = setIdStr !== "null" ? parseInt(setIdStr, 10) : null;

            // Include division name in the result
            const division = divisionName; // Division is now included

            if (setId !== null) {
                // Group items into Item_set for a valid setId
                const itemSet: ItemSet[] = [];

                Object.entries(items).forEach(([itemName, value]) => {
                    if (value !== 0) {
                        itemSet.push({
                            itemName: itemName.trim(),
                            value,
                        });
                    }
                });

                if (itemSet.length > 0) {
                    result.push({
                        setId,
                        set: {
                            Item_set: itemSet,
                        },
                        division, // Add division here
                    });
                }
            } else {
                // Handle items without a setId
                Object.entries(items).forEach(([itemName, value]) => {
                    if (value !== 0) {
                        result.push({
                            itemName: itemName.trim(),
                            value,
                            division, // Add division here
                        });
                    }
                });
            }
        });

        return result;
    };





    const toNextStep = () => {
        onSelected(transformInputValues(inputValues));
    }

    return (
        <>
            <div className="flex justify-center items-center w-full h-full mt-2">
                {/* {console.log('data -==-=-=-=-=-=-=>', groupedByDivisionAndSet)} */}
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
                                {/* {console.log('data -==-=-=-=-=-=-=>', inputValues)}
                                {console.log('groupedByDivisionAndSet -==-=-=-=-=-=-=>', groupedByDivisionAndSet)} */}
                                <TableBody className="border-b border-t border-l border-r border-gray-800">
                                    {Object.entries(groupedByDivisionAndSet).length === 0 ||
                                        Object.entries(groupedByDivisionAndSet).every(([divisionName, sets]) =>
                                            Object.entries(sets).every(([setName, setData]) => setData.items.length === 0)
                                        )
                                        ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center text-stone-950 py-4">
                                                    ไม่มีข้อมูล
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            Object.entries(groupedByDivisionAndSet).map(([divisionName, sets]) => (
                                                <>
                                                    {Object.entries(sets).map(([setName, { items, setId }]) => (
                                                        <>
                                                            <TableRow key={`${divisionName}-${setName}-${setId}`} className="bg-gray-200">
                                                                <TableCell colSpan={7} className="text-stone-950 font-bold">
                                                                    <div className="flex justify-between items-center">
                                                                        <span>
                                                                            {setName === 'ไม่มีหมวดหมู่'
                                                                                ? divisionName
                                                                                : `${divisionName} - ${setName}`}
                                                                        </span>
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectAllState[`${divisionName}-${setName}-${setId}`] || false}
                                                                                onChange={() => {
                                                                                    console.log(`Checkbox clicked for ${divisionName}-${setName}-${setId}`);
                                                                                    handleSelectAll(divisionName, setName, setId || undefined);
                                                                                }}
                                                                                className="ml-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                                                            />
                                                                            <span className="ml-2">เลือกทั้งหมด</span>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>

                                                            {items.map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell className="pt-0 pb-0 text-stone-950 border-r border-gray-400 text-left">
                                                                        {item.name}
                                                                    </TableCell>
                                                                    <TableCell className="pt-0 pb-0 pl-0 pr-0 text-stone-950 border-r border-gray-400 text-center">
                                                                        <div className="relative flex justify-center items-center">
                                                                            <img
                                                                                src={'http://172.20.48.135:9000/images' + '/items/' + item.img}
                                                                                alt={item.name}
                                                                                onClick={() =>
                                                                                    handleImageClick(
                                                                                        'http://172.20.48.135:9000/images' + '/items/' + item.img
                                                                                    )
                                                                                }
                                                                                className={`h-12 w-auto object-cover transition-transform duration-300 ease-in-out cursor-pointer ${expandedImage ===
                                                                                    'http://172.20.48.135:9000/images' + '/items/' + item.img
                                                                                    ? 'scale-[3] z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                                                                                    : ''
                                                                                    }`}
                                                                            />
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell className="pt-0 pb-0 text-stone-950 mb-2 border-r border-gray-400">
                                                                        <div className="flex justify-around">
                                                                            <div className="text-stone-950 border-r border-gray-400 flex items-center justify-center w-full">
                                                                                {item.statusCounts
                                                                                    .map((statusCount) => statusCount.count)
                                                                                    .reduce((a, b) => a + b, 0)}
                                                                            </div>
                                                                            <div className="text-stone-950 flex items-center justify-center w-full">
                                                                                {item.statusCounts
                                                                                    .filter((v) => v.status === 'ปกติ')
                                                                                    .map((statusCount) => statusCount.count)
                                                                                    .reduce((a, b) => a + b, 0)}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell className="pt-0 pb-0 mb-2 border-r border-gray-400 text-center">
                                                                        <div className="flex justify-around text-center">
                                                                            {['ปกติ', 'ถูกยืม', 'ชำรุด', 'หาย'].map((status) => (
                                                                                <div
                                                                                    key={status}
                                                                                    className="text-center text-stone-950 border-r border-gray-400 flex items-center justify-center w-full"
                                                                                >
                                                                                    {item.statusCounts
                                                                                        .filter((v) => v.status === status)
                                                                                        .map((statusCount) => statusCount.count)
                                                                                        .reduce((a, b) => a + b, 0)}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell className="pt-0 pb-0 text-stone-950 border-r border-gray-400 text-center">
                                                                        {item.postfixName}
                                                                    </TableCell>

                                                                    <TableCell className="pt-0 pb-0 text-stone-950 text-center">
                                                                        <input
                                                                            type="number"
                                                                            data-division={`${divisionName}-${setName}-${setId}`}
                                                                            data-item={item.name}
                                                                            className="w-16 px-2 py-1 border border-gray-400 rounded"
                                                                            max={item.statusCounts
                                                                                .filter((v) => v.status === 'ปกติ')
                                                                                .map((statusCount) => statusCount.count)
                                                                                .reduce((a, b) => a + b, 0)}
                                                                            min={0}
                                                                            value={inputValues[`${divisionName}-${setName}-${setId}`]?.[item.name] ?? 0}
                                                                            onChange={(e) => {
                                                                                const maxValue = item.statusCounts
                                                                                    .filter((v) => v.status === 'ปกติ')
                                                                                    .map((statusCount) => statusCount.count)
                                                                                    .reduce((a, b) => a + b, 0);
                                                                                const newValue = parseInt(e.target.value) || 0;

                                                                                const currentValue =
                                                                                    inputValues[`${divisionName}-${setName}-${setId}`]?.[item.name] || 0;
                                                                                const difference = newValue - currentValue;

                                                                                const value = Math.min(
                                                                                    Math.max(0, currentValue + difference),
                                                                                    maxValue
                                                                                );

                                                                                handleInputChange(`${divisionName}-${setName}-${setId}`, item.name, value);
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </>
                                                    ))}
                                                </>
                                            ))

                                        )}
                                </TableBody>
                                <TableFooter>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="mt-6 mb-6 flex justify-center space-x-4">
                {/* <Link href="/pages/user/home"> */}
                <button
                    onClick={() => route.push('/')}
                    type="button"
                    className="w-[100px] bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                >
                    ย้อนกลับ
                </button>
                {/* </Link> */}
                <button
                    onClick={() => toNextStep()}
                    type="button"
                    className="w-[100px] bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    ถัดไป
                </button>
            </div>
        </>
    )
}