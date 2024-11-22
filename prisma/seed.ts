const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const items = [
    { "name": "ธงประดับสัญลักษณ์พระนามาภิไธยย่อ ส.ท. ม่วง", "total": 49, "exists": 49, "status": "ปกติ", divisionId: 1, postfixId: 1 },
    { "name": "ธงตราสัญลักษณ์พระนามาภิไธยย่อ ส.ธ.", "total": 198, "exists": 198, "status": "ปกติ", divisionId: 1, postfixId: 1 },
    { "name": "ธงชาติไทย", "total": 204, "exists": 204, "status": "ปกติ", divisionId: 1, postfixId: 1 },
    { "name": "ธงตราสัญลักษณ์พระปรมาภิไธยย่อ ว.ป.ร.", "total": 267, "exists": 267, "status": "ปกติ", divisionId: 1, postfixId: 1 },
    { "name": "ธงประดับสัญลักษณ์พระนามาภิไธยย่อ ส.ก. น้ำเงิน", "total": 50, "exists": 50, "status": "ปกติ", divisionId: 1, postfixId: 1 },
    { "name": "ธงมหาวิทยาลัยผืนใหญ่ (ขึ้นเสาธง)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 2, postfixId: 1 },

    { "name": "ธงมหาวิทยาลัยผืนเล็ก", "total": 4, "exists": 4, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงมหาวิทยาลัยผืนเล็ก", "total": 1, "exists": 0, "status": "หาย", divisionId: 2, postfixId: 1 },
    
    { "name": "ธงกีฬาบัวน้ำเงินเกมส์ (แบบปัก)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงกีฬาบัวน้ำเงินเกมส์ (แบบสกรีน)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงชาติไทย (ขึ้นเสาธง)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงชาติไทย (ผืนเล็ก)", "total": 7, "exists": 7, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะบริหารธุรกิจ", "total": 4, "exists": 4, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะศิลปกรรมศาสตร์", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะครุศาสตร์อุตสาหกรรม", "total": 4, "exists": 4, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนวิทยาลัยการแพทย์แผนไทย", "total": 4, "exists": 4, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะวิทยาศาสตร์และเทคโนโลยี", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะเทคโนโลยีสื่อสารมวลชน", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะวิศวกรรมศาสตร์", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะสถาปัตยกรรมศาสตร์", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะเทคโนโลยีการเกษตร", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะเทคโนโลคหกรรมศาสตร์", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะศิลปศาสตร์", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ธงสกรีนคณะพยาบาลศาสตร์", "total": 2, "exists": 2, "status": "ปกติ", divisionId: 2, postfixId: 1 },
    { "name": "ผ้าปูโต๊ะสีฟ้า", "total": 20, "exists": 20, "status": "ปกติ", divisionId: 4, postfixId: 1 },
    { "name": "ผ้าปูโต๊ะสีเขียว", "total": 20, "exists": 20, "status": "ปกติ", divisionId: 4, postfixId: 1 },
    { "name": "พรมแดงขนห่วงไม่มีลาย (ผืนยาว) (1x10.28 เมตร)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 1 },
    { "name": "พรมแดงลูกฟูกไม่มีลาย (ผืนกว้าง) (1.98x11.48 เมตร)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 1 },
    { "name": "พรมแดง มีลาย (2.09x3.07 เมตร)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 1 },
    { "name": "พรมสีเหลือง มีลาย (2x2.94 เมตร)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 1 },
    { "name": "คูลเลอร์", "total": 20, "exists": 20, "status": "ปกติ", divisionId: 1, postfixId: 2 },

    { "name": "เก้าอี้หลุย", "total": 7, "exists": 0, "status": "หาย", divisionId: 2, postfixId: 3 },
    { "name": "เก้าอี้หลุย", "total": 2, "exists": 2, "status": "ปกติ", divisionId: 2, postfixId: 3 },

    { "name": "วอคเกอร์", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 3, postfixId: 3 },
    { "name": "ลำโพงเล็ก", "total": 2, "exists": 2, "status": "ปกติ", divisionId: 4, postfixId: 3 },
    { "name": "ลำโพงใหญ่", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 4, postfixId: 3 },
    { "name": "แท่นกราบ", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 3 },
    { "name": "โต๊ะเคียงเก้าอี้หลุย", "total": 4, "exists": 4, "status": "ปกติ", divisionId: 2, postfixId: 4 },
    { "name": "หีบเลือกตั้ง", "total": 50, "exists": 50, "status": "ปกติ", divisionId: 2, postfixId: 5 },
    { "name": "คูหาเลือกตั้ง", "total": 60, "exists": 60, "status": "ปกติ", divisionId: 2, postfixId: 6 },
    { "name": "ป้ายมหาวิทยาลัย (อันใหญ่)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 2, postfixId: 22 },
    { "name": "วิลแชร์ (พับได้)", "total": 11, "exists": 11, "status": "ปกติ", divisionId: 3, postfixId: 7 },
    { "name": "วิลแชร์ (พับไม่ได้)", "total": 4, "exists": 4, "status": "ปกติ", divisionId: 3, postfixId: 7 },
    { "name": "ไม้ค้ำยัน ไซส์ 42 นิ้ว", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 3, postfixId: 8 },
    { "name": "ไม้ค้ำยัน ไซส์ 46 กว้าง 18 ซม. สูง 113-121 ซม. (เหมาะสำหรับส่วนสูง 135-144 ซม.)", "total": 3, "exists": 3, "status": "ปกติ", divisionId: 3, postfixId: 8 },
    { "name": "ไม้ค้ำยัน ไซส์ 48 กว้าง 18 ซม. สูง 118-126 ซม. (เหมาะสำหรับส่วนสูง 145-154 ซม.)", "total": 2, "exists": 2, "status": "ปกติ", divisionId: 3, postfixId: 8 },
    { "name": "ไม้ค้ำยัน ไซส์ 50 กว้าง 18 ซม. สูง 123-131 ซม. (เหมาะสำหรับส่วนสูง 155-164 ซม.)", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 3, postfixId: 8 },
    { "name": "ไม้ค้ำยัน ไซส์ 52 กว้าง 18 ซม. สูง 128-136 ซม. (เหมาะสำหรับส่วนสูง 165-174 ซม.)", "total": 5, "exists": 5, "status": "ปกติ", divisionId: 3, postfixId: 8 },
    { "name": "ไม้เท้าหัวฆ้อน 3 ขา", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 3, postfixId: 8 },
    { "name": "ไม้เท้าก้านร่ม", "total": 3, "exists": 3, "status": "ปกติ", divisionId: 3, postfixId: 8 },
    { "name": "ไม้เท้าขาเดียวค้ำข้อศอก", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 3, postfixId: 8 },
    { "name": "โรลอัพ 2.28*1.5 เมตร", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 4, postfixId: 8 },
    { "name": "ขาตั้งตาลปัตร", "total": 10, "exists": 10, "status": "ปกติ", divisionId: 5, postfixId: 8 },
    { "name": "เชิงเทียนชนวน", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 8 },
    { "name": "แบนเนอร์ 3*2.28 เมตร", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 4, postfixId: 9 },
    { "name": "ฟลิปชาร์ต", "total": 3, "exists": 3, "status": "ปกติ", divisionId: 4, postfixId: 9 },
    { "name": "เครื่องบันทึกเสียง (DSS)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 4, postfixId: 10 },
    { "name": "เครื่องขยายภาพ สำหรับผู้พิการสายตา", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 4, postfixId: 10 },
    { "name": "หัวลากวิลแชร์", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 4, postfixId: 11 },
    { "name": "กระธางธูปทองเหลือง", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 12 },
    { "name": "กระถางธูปปูนปั้นสีขาว", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 12 },  
    { "name": "ขันโตกไม้ (ใหญ่)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 12 },
    { "name": "ขันโตกไม้ (กลาง)", "total": 2, "exists": 2, "status": "ปกติ", divisionId: 5, postfixId: 12 },
    { "name": "ขันน้ำมนต์พร้อมพานรอง", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 12 },
    { "name": "เบาะรองนั่งสีเขียว สำหรับอาสนะสงฆ์", "total": 10, "exists": 10, "status": "ปกติ", divisionId: 5, postfixId: 12 },
    { "name": "เบาะรองนั่งสีทองลายกุหลาบ สำหรับอาสนะสงฆ์", "total": 10, "exists": 10, "status": "ปกติ", divisionId: 5, postfixId: 12 },
    { "name": "เบาะรองนั่งสีทองลายดอกไม้ สำหรับอาสนะสงฆ์", "total": 10, "exists": 10, "status": "ปกติ", divisionId: 5, postfixId: 12 },
    { "name": "เครื่องนมัสการทองน้อย", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 13 },
    { "name": "พานธูปเทียนแพสีม่วง", "total": 3, "exists": 3, "status": "ปกติ", divisionId: 5, postfixId: 13 },
    { "name": "พานธูปเทียนแพสีเหลือง", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 13 },
    { "name": "พานธูปเทียนแพสีฟ้า", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 13 },
    { "name": "พานแว่นฟ้า", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 13 },
    { "name": "เชิงเทียนทองเหลือง", "total": 2, "exists": 2, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "เชิงเทียนปูนปั้นสีขาว", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่ม 5 ยอด", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มเงินทอง พานแก้ว", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มเงินทอง (ใหญ่)", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มเงินทอง1", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มเงินทอง2", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มเงินทอง3", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มเงินทอง4", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มเงินทอง5", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มเงินทอง6", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกไม้สีขาว", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกไม้สีฟ้า", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกกุหลาบสีฟ้า", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกไม้ สีม่วง1", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกไม้ สีม่วง2", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกไม้ สีม่วง3", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกไม้ สีม่วง4", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกกุหลาบสีม่วง", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกไม้สีเหลือง1", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "พุ่มดอกไม้สีเหลือง2", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 14 },
    { "name": "ตาลปัตร", "total": 10, "exists": 10, "status": "ปกติ", divisionId: 5, postfixId: 15 },
    { "name": "ไม้พรมน้ำมนต์", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 16 },
    { "name": "บายศรีต้น", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 17 },
    { "name": "ภาชนะกรวดน้ำ", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 19 },
    { "name": "สายสิญจน์", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 18 },
    { "name": "อาสนะสงฆ์แบบมีพนักพิงสีแดง", "total": 10, "exists": 10, "status": "ปกติ", divisionId: 5, postfixId: 19 },
    { "name": "อาสนะสงฆ์แบบมีพนักพิงสีเหลือง", "total": 10, "exists": 10, "status": "ปกติ", divisionId: 5, postfixId: 19 },
    { "name": "พระฉายาลักษณ์สมเด็จพระบรมราช ชนนีพันปีหลวง (ใหญ่) 1.48x2.66 เมตร", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระบรมฉายาลักษณ์ พระบาทสมเด็จพระมหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร (ใหญ่) 1.36x2.54 เมตร", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระบรมฉายาลักษณ์ พระบาทสมเด็จพระมหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร กรอบทอง 60.5x86 ซม.", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระบรมฉายาลักษณ์ พระบาทสมเด็จพระมหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร กรอบลาย 59x84 ซม.", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระฉายาลักษณ์สมเด็จพระนางเจ้า ฯ พระบรมราชินี กรอบทอง 60x85 ซม.", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระฉายาลักษณ์สมเด็จพระนางเจ้า ฯ พระบรมราชินี กรอบลาย 90x115 ซม.", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระฉายาลักษณ์สมเด็จพระกนิษฐาธิราชเจ้ากรมสมเด็จพระเทพรัตนราชสุดา ฯ สยามบรมราชกุมารี กรอบทอง 60.5x86 ซม.", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระฉายาลักษณ์สมเด็จพระกนิษฐาธิราชเจ้ากรมสมเด็จพระเทพรัตนราชสุดา ฯ สยามบรมราชกุมารี กรอบลาย 71x81.5 ซม.", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระฉายาลักษณ์สมเด็จพระเจ้าลูกเธอเจ้าฟ้าพัชรกิติยาภา ฯ กรอบทอง 67x92 ซม.", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระฉายาลักษณ์สมเด็จพระเจ้าลูกเธอเจ้าฟ้าพัชรกิติยาภา ฯ กรอบลาย 65x91 ซม.", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระบรมฉายาลักษณ์ ร.10 คู่พระบรมราชินี 1.40x2.62 เมตร", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 20 },
    { "name": "พระรูปสมเด็จพระอริยวงศาคตญาณ สมเด็จพระสังฆราชสกลมหาสังฆปริณายก 66.5x92 เมตร", "total": 1, "exists": 1, "status": "ปกติ", divisionId: 5, postfixId: 21 },

    //------
    { "name": "หมอนอิง", "total": 1, "exists": 1, "status": "หาย", divisionId: 5, postfixId: 12 }, // ไม่บอก total มา
    { "name": "กระโถน", "total": 1, "exists": 1, "status": "หาย", divisionId: 5, postfixId: 12 }, // ไม่บอก total มา
    { "name": "ขันเงินขนาดเล็ก (6x3.5 ซม.)", "total": 1, "exists": 1, "status": "หาย", divisionId: 5, postfixId: 12 }, // ไม่บอก total มา
    { "name": "ขันเงินขนาดใหญ่ (36.5x16.5 ซม.)", "total": 1, "exists": 1, "status": "หาย", divisionId: 5, postfixId: 12 }, // ไม่บอก total มา

];

const main = async () => {
    // const itemsData = await prisma.items.createMany({
    //     data: items
    // })
    for (const item of items) {
        for (let i = 0; i < item.total; i++) {
            const itemsData = await prisma.items.create({
                data: {
                    name: item.name,
                    status: item.status,
                    divisionId: item.divisionId,
                    postfixId: item.postfixId
                }
            })
            console.log('items data created ---> \n', itemsData)
        }
    }
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(e => console.error(e)).finally(async () => await prisma.$disconnect())


