module.exports = {
  apps: [{
    name: "nextjs-app",        // ตั้งชื่อให้กับแอป
    script: "npm",             // ใช้ npm แทนการใช้คำสั่ง `start`
    args: "start",             // เพิ่มคำสั่ง `start`
    cwd: "C:/path/to/your/project", // กำหนด path ของโปรเจคที่ต้องการ
    watch: false,              // ปิดการติดตามไฟล์สำหรับการอัพเดต
    env: {
      NODE_ENV: "production",  // ตั้งค่า environment สำหรับการ production
    },
  }],

  deploy: {
    production: {
      user: "your-ssh-user",        // ใช้เมื่อทำการ deploy ไปยังเครื่องอื่นผ่าน SSH
      host: "203.158.120.66",   // ระบุที่อยู่ IP หรือ domain ของเซิร์ฟเวอร์
      ref: "origin/main",         // ใช้ branch ที่ต้องการ deploy
      repo: "https://github.com/your84120/division.git",  // URL ของ Git repository
      path: "C:/path/to/your/deployment/folder", // ตำแหน่งที่คุณต้องการ deploy
      "pre-deploy-local": "",      // คำสั่งก่อนทำการ deploy บนเครื่อง local
      "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production", // คำสั่งหลังการ deploy
      "pre-setup": "",             // คำสั่งก่อน setup
    },
  },
};
