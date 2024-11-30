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
    );
}