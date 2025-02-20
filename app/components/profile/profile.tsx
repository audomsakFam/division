'use client'
import { ResOri, ResOriData } from '@/app/interfaces/ori';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Profile = ({ onNext, onBack }: any) => {

  const [status, setStatus] = useState<string>('');
  const [formData, setFormData] = useState<any>({});
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [ori, setOri] = useState<ResOriData[]>([]);

  useEffect(() => {
    const fetchOri = async () => {
      try {
        const res = await axios.get<ResOri>('/api/Origanization');
        setOri(res.data.data);
      } catch (err) {
        console.error('err get ori --->', err);
      }
    }

    fetchOri();
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = event.target as HTMLInputElement; // รองรับ input file

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: files && files.length > 0 ? files[0] : value, // เก็บไฟล์ในกรณีที่เป็น `type="file"`
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(event.target.checked);
  };


  const handleSelectChangeBorrower = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setStatus(event.target.value);
    console.log(status)
    setFormData({}); // Reset form data when status changes
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isStaffValid = () =>
    formData['name'] &&
    formData['lastname'] &&
    formData['tel'] &&
    formData['otherTel'] &&
    formData['type_borrow'] &&
    formData['origanizationId'];

  const isStudentValid = () =>
    formData['name'] &&
    formData['lastname'] &&
    formData['tel'] &&
    formData['otherTel'] &&
    formData['borrower_id'] &&
    formData['type_borrow'] &&
    formData['mentor_name'] &&
    formData['mentor_last'] &&
    formData['origanizationId'] &&
    formData['image'];

  const isFormValid = () => {
    if (status === 'staff') {
      return isStaffValid() && acceptedTerms;
    } else {
      return isStudentValid() && acceptedTerms;
    }
  };

  const toNextStep = () => {
    onNext(formData);
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-3 pb-3 flex items-center justify-center pl-2 pr-2">
      <div className="bg-white pt-6 pb-6 pl-2 pr-2 rounded-lg shadow-md w-full max-w-lg">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">กรอกข้อมูลส่วนตัว</h1>
        </header>
        <section id="personal-info">
          <form>
            <div className="mb-4">
              <label htmlFor="type_borrow" className="block text-gray-700 font-medium mb-2">
                1. สถานะ:
              </label>
              <select
                id="type_borrow"
                name="type_borrow"
                value={formData.type_borrow || ''}
                onChange={handleSelectChangeBorrower}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-200"
              >
                <option value="">เลือกสถานะ</option>
                <option value="staff">บุคลากร</option>
                <option value="student">นักศึกษา</option>
              </select>
            </div>

            {status === 'staff' && (
              <div id="staff-info">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">2. ชื่อ:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastname" className="block text-gray-700 font-medium mb-2">3. นามสกุล:</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="tel" className="block text-gray-700 font-medium mb-2">4. เบอร์โทรศัพท์มือถือ:</label>
                  <input
                    type="tel"
                    id="tel"
                    name='tel'
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="otherTel" className="block text-gray-700 font-medium mb-2">5. เบอร์โทรสำนักงาน:</label>
                  <input
                    type="tel"
                    id="otherTel"
                    name="otherTel"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="origanizationId" className="block text-gray-700 font-medium mb-2">6. คณะ/หน่วยงาน:</label>
                  <select
                    id="origanizationId"
                    name="origanizationId"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">เลือกคณะ</option>
                    {
                      ori.map((v, i) => (
                        <option value={v.id} key={i} className="">{v.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            )}

            {status === 'student' && (
              <div id="student-info">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">2. ชื่อ:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastname" className="block text-gray-700 font-medium mb-2">3. นามสกุล:</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="tel" className="block text-gray-700 font-medium mb-2">4. เบอร์โทรศัพท์มือถือ:</label>
                  <input
                    type="tel"
                    id="tel"
                    name='tel'
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="origanizationId" className="block text-gray-700 font-medium mb-2">5. คณะที่นักศึกษาอยู่:</label>
                  <select
                    id="origanizationId"
                    name="origanizationId"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">เลือกคณะ</option>
                    {
                      ori.map((v, i) => (
                        v.group === 1 && <option value={v.id} key={i} className="">{v.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="borrower_id" className="block text-gray-700 font-medium mb-2">6. บัตรนักศึกษา/บัตรประชาชน:</label>
                  <input
                    type="file"
                    id="borrower_id"
                    name="borrower_id"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="mentor_name" className="block text-gray-700 font-medium mb-2">7. ชื่อ-อาจารย์ที่ปรึกษา:</label>
                  <input
                    type="text"
                    id="mentor_name"
                    name="mentor_name"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="mentor_last" className="block text-gray-700 font-medium mb-2">8. นามสกุล-อาจารย์ที่ปรึกษา:</label>
                  <input
                    type="text"
                    id="mentor_last"
                    name="mentor_last"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="otherTel" className="block text-gray-700 font-medium mb-2">9. เบอร์อาจารย์ที่ปรึกษา:</label>
                  <input
                    type="tel"
                    id="otherTel"
                    name="otherTel"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-gray-700 font-medium mb-2">10. ลายเซ็นรับรองจากอาจารย์:</label>
                  <p className='text-red-500'>ตัวอย่าง :</p>
                  <img src={"/images/การรับรองการยืมของ.jpg"} alt="signature" className="w-[100%]" />
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">11. ในวันที่มารับวัสดุ-อุปกรณ์ นักศึกษาสามารถให้บัตรที่ออกโดยราชการไว้</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="choice" value="yes" className="form-radio" />
                      <span>สามารถให้บัตรไว้ได้</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center space-x-4">

              <button
                onClick={() => onBack()}
                type="button"
                className="w-[100px] bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
              >
                ย้อนกลับ
              </button>

              <button
                onClick={() => toNextStep()}
                type="button"
                disabled={!isFormValid()}
                className={`w-[100px] py-2 px-4 rounded-md transition duration-200 ${isFormValid()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
              >
                ยืนยัน
              </button>

            </div>
            {status != '' && (
              <div className="flex items-center space-x-4 mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="choice"
                    value="yes"
                    onChange={handleCheckboxChange}
                    className="form-radio"
                  />
                  <span>ยอมรับตามเงื่อนไข</span>
                </label>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
