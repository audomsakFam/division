"use client"
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "react-hook-form";
import { GetBorrowWithCache } from "@/lib/servers/getItemWithCache";
import { th } from 'date-fns/locale';
export default function CalendarCom() {
    const [eventDates, setEventDates] = useState({
        borrowed: [] as { start: Date, end: Date }[],  // เก็บเป็นอาร์เรย์ของอ็อบเจ็กต์ที่มี start และ end เป็น Date
        returned: [] as Date[],
        eventDetail: [] as string[],
    });
    const [loading, setLoading] = useState(true);
    const { setValue, watch } = useForm();
    const fieldValue = watch("dateRange");

    useEffect(() => {
        const setData = async () => {
            await GetBorrowWithCache().then((res) => {
                setEventDates({
                    borrowed: res.filter((item) => item.status !== 4).map((item) => ({
                        start: new Date(item.createAt),  // เปลี่ยนเป็น Date
                        end: new Date(item.retureAt),    // เปลี่ยนเป็น Date
                    })),
                    returned: res.filter((item) => item.status !== 4).map((item) => new Date(item.retureAt)),
                    // eventDetail: res.filter((item) => item.status !== 4).map((item) => `โครงการ ${item.project} โดย ${item.name}`),
                    eventDetail: res.filter((item) => item.status !== 4).map((item) => `${new Date(item.createAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })} ${item.name}`),
                });
            });
            setLoading(false);
        }
        setData();
    }, []);

    // ฟังก์ชันกำหนดสีตามเงื่อนไข
    // const getDayColor = (date: Date) => {
    //     const isBorrowed = eventDates.borrowed.some(
    //         (event) => date >= event.start && date <= event.end  // เปรียบเทียบ Date โดยตรง
    //     );
    //     const isReturned = eventDates.returned.some(
    //         (d) => date.toISOString().split("T")[0] === d.toISOString().split("T")[0]  // เปรียบเทียบ Date
    //     );
    //     const today = new Date();
    //     const isToday = date.toISOString().split("T")[0] === today.toISOString().split("T")[0];

    //     if ((isToday && isBorrowed && isReturned) || (isToday && isBorrowed) || (isToday && isReturned)) return "bg-gradient-to-r from-red-500 via-blue-900 to-yellow-500 text-white"; // วันปัจจุบัน
    //     if (isBorrowed && isReturned) {
    //         return "bg-gradient-to-r from-red-500 to-yellow-500 text-white"; // สีแดงและเหลืองสำหรับยืมและคืนในวันเดียวกัน
    //     }
    //     if (isBorrowed) return "bg-red-500 text-white"; // วันที่ยืม
    //     if (isReturned) return "bg-yellow-500 text-black"; // วันที่คืน
    //     if (isToday) return "bg-blue-300 text-black"; // วันที่คืน
    //     return "bg-white text-black"; // วันอื่นๆ
    // };


    // ฟังก์ชันแสดงรายละเอียดเหตุการณ์

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="w-full bg-white h-[auto] mb-4 rounded-md border shadow p-0">
            <Calendar
                className="h-[auto] w-full flex "
                classNames={{
                    months:
                        "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                    month: "space-y-4 w-full flex flex-col",
                    table: "w-full h-full border-collapse space-y-1",
                    head_row: "",
                    row: "w-full mt-2",
                }}
                components={{
                    Day: ({ date }) => {
                        const newDate = new Date(date);
                        newDate.setDate(date.getDate() + 1);  // เพิ่ม 1 วัน
                        // const dayClasses = getDayColor(newDate);

                        const eventDetail = eventDates.borrowed
                            .filter((event) => {
                                const eventEndDate = new Date(event.end);
                                eventEndDate.setDate(eventEndDate.getDate() + 1); // เพิ่ม 1 วันเพื่อรวมวันที่สุดท้าย

                                return newDate >= event.start && newDate <= eventEndDate;
                            })
                            .map((event) => {
                                const index = eventDates.borrowed.indexOf(event);
                                const baseDetail = eventDates.eventDetail[index]; // ข้อความเดิม

                                // ปรับ newDate และ event.end ให้เป็นเวลา 00:00:00 ก่อนเปรียบเทียบ
                                const normalizeDate = (date: Date) => {
                                    const normalized = new Date(date);
                                    normalized.setHours(0, 0, 0, 0); // รีเซ็ตเวลาเป็น 00:00:00
                                    return normalized;
                                };
                                const normalizedEndDate = new Date(event.end);
                                normalizedEndDate.setDate(normalizedEndDate.getDate() + 1);
                                const isEndDate = normalizeDate(newDate).getTime() === normalizeDate(normalizedEndDate).getTime(); // เปรียบเทียบวันที่หลัง normalize
                                console.log("date event------->", normalizeDate(normalizedEndDate).toDateString());
                                console.log("date event new------->", normalizeDate(newDate).toDateString());
                                console.log("date event isEndDate------->", isEndDate);

                                // const additionalDetail = isEndDate ? "คืน" : "ยืม"; // ถ้าตรงเพิ่ม "คืน" ถ้าไม่ตรงเพิ่ม "ยืม"

                                // return `${baseDetail} (${additionalDetail})`; // เพิ่มข้อความต่อท้าย
                                return `${baseDetail} `; // เพิ่มข้อความต่อท้าย
                            });
                        const getDayDetail = (date: Date) => {
                            console.log('detail ---> ', eventDetail)
                            return eventDetail.length > 0 ? eventDetail.join(", ") : '';
                        };

                        const detailToShow = eventDetail.length > 0 ? eventDetail.join('\n') : "ไม่มีข้อมูลกิจกรรม";
                        return (
                            // <div className={`w-full h-full border-y flex items-center justify-center cursor-pointer whitespace-per-line p-0`} title={detailToShow}>
                            //     <div className={`${dayClasses} w-full h-[30px] sm:h-[100px] flex items-center justify-center border-r border-gray-500`}>
                            //         {date.getDate()}
                            //     </div>
                            // </div>
                            <div
                                className={`w-full h-full border-y flex items-center justify-center cursor-pointer whitespace-pre-line p-0`}
                                // className={`w-full h-full border-y flex items-center justify-center cursor-pointer whitespace-pre-line p-0`}
                                // title={detailToShow}
                            >
                                <div className="w-full h-[30px] sm:h-[100px] flex flex-col items-center justify-start border-r border-gray-500">
                                    <span className={date.toDateString() === new Date().toDateString() ? "text-blue-500 font-bold" : ""}>
                                        {date.getDate()}
                                    </span>
                                      {/* <span>{date.getDate()}</span>  */}
                                    <span>{getDayDetail(newDate)}</span>
                                </div>
                            </div>
                        );
                    },
                }}
                initialFocus
                mode="range"
                selected={fieldValue}
                onSelect={(range) => setValue("dateRange", range)}
                numberOfMonths={1}
                defaultMonth={fieldValue?.from}
                locale={th}
            />
            {/* <div className="flex flex-col gap-2 ml-12 mt-2 mb-2">
                <p className="flex items-center">
                    <div className="bg-blue-300 rounded-full w-4 h-4 mr-2"></div>
                    วันนี้
                </p>
                <p className="flex items-center">
                    <div className="bg-red-500 rounded-full w-4 h-4 mr-2"></div>
                    วันที่ยืม
                </p>
                <p className="flex items-center">
                    <div className="bg-yellow-500 rounded-full w-4 h-4 mr-2"></div>
                    วันที่คืน
                </p>
                <p className="flex items-center">
                    <div className="bg-gradient-to-r from-red-500 via-blue-900 to-yellow-500 rounded-full w-4 h-4 mr-2"></div>
                    วันนี้และมีหลายเหตุการณ์
                </p>
            </div> */}

        </div>
    );
}