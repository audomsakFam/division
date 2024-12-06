'use client'
import Link from 'next/link';
import React, { useState } from 'react';

const Profile = () => {
  const [status, setStatus] = useState<string>('staff');

  const toggleInfo = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-3 pb-3 flex items-center justify-center pl-2 pr-2">
      <div className="bg-white pt-6 pb-6 pl-2 pr-2 rounded-lg shadow-md w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">กรอกข้อมูลส่วนตัว</h1>
        </header>
        <section id="personal-info">
          <form>
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 font-medium mb-2">1. สถานะ:</label>
              <select
                id="status"
                value={status}
                onChange={toggleInfo}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-200"
              >
                <option value="staff">บุคลากร</option>
                <option value="student">นักศึกษา</option>
              </select>
            </div>

            {status === 'staff' && (
              <div id="staff-info">
                <div className="mb-4">
                  <label htmlFor="staff-name" className="block text-gray-700 font-medium mb-2">2. ชื่อ-นามสกุล:</label>
                  <input
                    type="text"
                    id="staff-name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="staff-phone" className="block text-gray-700 font-medium mb-2">3. เบอร์โทรศัพท์มือถือ:</label>
                  <input
                    type="tel"
                    id="staff-phone"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="office-phone" className="block text-gray-700 font-medium mb-2">4. เบอร์โทรสำนักงาน:</label>
                  <input
                    type="tel"
                    id="office-phone"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="faculty" className="block text-gray-700 font-medium mb-2">5. คณะ/หน่วยงาน:</label>
                  <select
                    id="faculty"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">เลือกคณะ</option>
                    <option value="engineering">วิศวกรรมศาสตร์</option>
                    <option value="business">บริหารธุรกิจ</option>
                    <option value="home-economics">คหกรรมศาสตร์</option>
                  </select>
                </div>
              </div>
            )}

            {status === 'student' && (
              <div id="student-info">
                <div className="mb-4">
                  <label htmlFor="student-name" className="block text-gray-700 font-medium mb-2">2. ชื่อ-นามสกุล:</label>
                  <input
                    type="text"
                    id="student-name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="student-phone" className="block text-gray-700 font-medium mb-2">3. เบอร์โทรศัพท์มือถือ:</label>
                  <input
                    type="tel"
                    id="student-phone"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="student-faculty" className="block text-gray-700 font-medium mb-2">4. คณะที่นักศึกษาอยู่:</label>
                  <select
                    id="student-faculty"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">เลือกคณะ</option>
                    <option value="engineering">วิศวกรรมศาสตร์</option>
                    <option value="business">บริหารธุรกิจ</option>
                    <option value="home-economics">คหกรรมศาสตร์</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="student-id" className="block text-gray-700 font-medium mb-2">5. บัตรนักศึกษา/บัตรประชาชน:</label>
                  <input
                    type="file"
                    id="student-id"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="advisor-name" className="block text-gray-700 font-medium mb-2">6. ชื่อ-นามสกุลอาจารย์ที่ปรึกษา:</label>
                  <input
                    type="text"
                    id="advisor-name"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="advisor-phone" className="block text-gray-700 font-medium mb-2">7. เบอร์อาจารย์ที่ปรึกษา:</label>
                  <input
                    type="tel"
                    id="advisor-phone"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="advisor-signature" className="block text-gray-700 font-medium mb-2">8. ลายเซ็นรับรองจากอาจารย์:</label>
                  <p className='text-red-500'>ตัวอย่าง :</p>
                  <img src="/images/การรับรองการยืมของ.jpg" alt="signature" className="w-[100%]" />
                  <input
                    type="file"
                    id="advisor-signature"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">9. ในวันที่มารับวัสดุ-อุปกรณ์ นักศึกษาสามารถให้บัตรที่ออกโดยราชการไว้</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="choice" value="yes" className="form-radio" />
                      <span>สามารถให้บัตรไว้ได้</span>
                    </label>
                    {/* <label className="flex items-center space-x-2">
                      <input type="radio" name="choice" value="no" className="form-radio" />
                      <span>No</span>
                    </label> */}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center space-x-4">
              <Link href="/pages/user/home">
                <button
                  type="button"
                  className="w-[100px] bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  ย้อนกลับ
                </button>
              </Link>
              <Link href="/pages/user/date">
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
  );
};

export default Profile;
