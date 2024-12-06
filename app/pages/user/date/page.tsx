'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function DateComponent() {
  const [currentDate, setCurrentDate] = useState("");
  const [minPickupDate, setMinPickupDate] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [minReturnDate, setMinReturnDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setCurrentDate(formattedToday);

    const minPickup = new Date();
    minPickup.setDate(minPickup.getDate() + 2);
    const formattedMinPickup = minPickup.toISOString().slice(0, 16);
    setMinPickupDate(formattedMinPickup);
  }, []);

  const handlePickupDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPickupDate = e.target.value;
    setPickupDate(selectedPickupDate);
    setMinReturnDate(selectedPickupDate.split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-6 pb-6 pr-2 pl-2 flex items-center justify-center">
      <div className="bg-white pt-6 pb-6 pl-2 pr-2 rounded-lg shadow-md w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">ระบุวันเวลาและวัตถุประสงค์</h1>
        </header>
        <section id="schedule-form">
          <form>
            <div className="mb-4">
              <label htmlFor="borrow-date" className="block text-gray-700 font-medium mb-2">วันที่ยืม:</label>
              <input
                type="date"
                id="borrow-date"
                value={currentDate}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="pickup-time" className="block text-gray-700 font-medium mb-2">วันเวลาที่สะดวกเข้ามารับของ:</label>
              <input
                type="datetime-local"
                id="pickup-time"
                min={minPickupDate}
                value={pickupDate}
                onChange={handlePickupDateChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="return-date" className="block text-gray-700 font-medium mb-2">วันที่คืน:</label>
              <input
                type="date"
                id="return-date"
                min={minReturnDate}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="purpose" className="block text-gray-700 font-medium mb-2">โครงการ/กิจกรรม:</label>
              <textarea
                id="purpose"
                placeholder="ระบุ โครงการ/กิจกรรม ที่ท่านนำวัสดุอุปกรณ์ของกองพัฒนาศึกษาไปใช้..."
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Link href="/pages/user/profile">
                <button
                  type="button"
                  className="w-[100px] bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  ย้อนกลับ
                </button>
              </Link>
              <Link href="/pages/user/summary">
                <button
                  type="button"
                  className="w-[100px] bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  ยืนยัน
                </button>
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
