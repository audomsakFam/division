'use client'
import { ResItemsGroup } from "@/app/interfaces/item";
// import { Button } from "@/components/ui/button";
import { GetItemWithCache } from "@/lib/servers/getItemWithCache";
// import { useRouter } from "next/navigation";
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

export default function HomePage() {
    // const router = useRouter();
    const [items, setItems] = useState<ResItemsGroup[]>([]);

    useEffect(() => {
        GetItemWithCache().then((res) => setItems(res));
    }, [])
    return (
        <>
            <div className="flex justify-center items-center w-full h-full">
                <div className="h-[100vh] overflow-auto w-[70%] flex flex-col items-center">
                    <Card className="w-full m-2">
                        <CardHeader>
                            <CardTitle className="text-center">Create project</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table className="overflow-hidden">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[35%] text-lg font-bold text-neutral-950">ชื่ออุปกรณ์</TableHead>
                                        <TableHead className="text-lg font-bold text-neutral-950">รูปภาพ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((v, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{v.name}</TableCell>
                                            <TableCell>
                                                {
                                                    v.img ? <img src={v.img} alt="img" className="w-[50px]" /> : 'no img'
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