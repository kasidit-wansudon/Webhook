# Node.js Webhook พร้อมการแจ้งเตือนผ่าน WebSocket

คู่มือนี้จะช่วยคุณสร้างเซิร์ฟเวอร์ Node.js แบบง่าย ๆ ที่รับ Webhook ผ่านคำขอ POST ส่งข้อมูลที่ได้รับไปยังผู้ใช้ผ่าน WebSocket และแสดงข้อมูลบนหน้าเว็บแบบเรียลไทม์

## ข้อกำหนดเบื้องต้น

- ติดตั้ง Node.js บนระบบของคุณ
- มีความเข้าใจพื้นฐานเกี่ยวกับ JavaScript และ Node.js

## ขั้นตอนการเริ่มต้น

### 1. ตั้งค่าโปรเจกต์

1. สร้างไดเรกทอรีใหม่สำหรับโปรเจกต์ของคุณและเข้าสู่ไดเรกทอรีนั้น:

    ```bash
    mkdir nodejs-webhook
    cd nodejs-webhook
    ```

2. เริ่มต้นโปรเจกต์ Node.js ใหม่:

    ```bash
    npm init -y
    ```

3. ติดตั้งแพ็กเกจที่จำเป็น:

    ```bash
    npm install express ws
    ```

### 2. สร้างเซิร์ฟเวอร์ Node.js

1. สร้างไฟล์ชื่อ `server.js` และเพิ่มโค้ดต่อไปนี้:

    ```javascript
    const express = require('express');
    const WebSocket = require('ws');

    const app = express();
    const wss = new WebSocket.Server({ port: 8081 });

    // Middleware เพื่อแปลง JSON body
    app.use(express.json());

    // Endpoint สำหรับรับคำขอ POST จาก Webhook
    app.post('/webhook', (req, res) => {
        const data = req.body;
        console.log('Webhook received:', data);

        // ส่งข้อมูลไปยังผู้ใช้ที่เชื่อมต่อผ่าน WebSocket
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });

        // ตอบกลับไปยังผู้ส่ง Webhook
        res.status(200).send('Webhook received successfully');
    });

    // เริ่มต้นเซิร์ฟเวอร์ Express บนพอร์ต 3000
    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
    ```

2. 1 รันเซิร์ฟเวอร์:

    ```bash
    node server.js
    ```
2. 2 รันเซิร์ฟเวอร์ในโหมดดีบั๊ก:

    ```bash
    npm run dev
    ```

### 3. สร้างหน้า HTML

1. สร้างไฟล์ชื่อ `index.html` และเพิ่มโค้ดต่อไปนี้:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Webhook Notifications</title>
    </head>
    <body>
        <h1>Webhook Notifications</h1>
        <div id="notifications"></div>

        <script>
            const socket = new WebSocket('ws://localhost:8081');

            socket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                const notificationsDiv = document.getElementById('notifications');
                notificationsDiv.innerHTML += `<p>Event: ${data.event}, Message: ${data.message}</p>`;
            };

            socket.onclose = function() {
                console.log('WebSocket connection closed');
            };
        </script>
    </body>
    </html>
    ```

2. เปิดไฟล์ `index.html` ในเว็บเบราว์เซอร์ของคุณ

### 4. ทดสอบ Webhook

ใช้ `curl` หรือเครื่องมือ HTTP client อื่น ๆ เพื่อส่งคำขอ POST ไปยัง Webhook:

- **Windows (PowerShell)**:

    ```powershell
    Invoke-WebRequest -Uri "http://localhost:3000/webhook" -Method POST -ContentType "application/json" -Body '{"event": "New Order", "message": "Order #12345"}'
    ```

- **macOS/Windows (Git Bash)**:

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"event": "New Order", "message": "Order #12345"}' http://localhost:3000/webhook
    ```

### 5. ดูการแจ้งเตือน

เมื่อคุณส่งคำขอ POST ข้อมูลจะถูกแสดงผลแบบเรียลไทม์บนหน้า `index.html` ผ่าน WebSocket

## สรุป

- **Node.js Server**: รับข้อมูลจากคำขอ POST ของ Webhook และส่งไปยังผู้ใช้ผ่าน WebSocket
- **WebSocket Client**: แสดงข้อมูลที่ได้รับบนหน้าเว็บแบบเรียลไทม์

การตั้งค่านี้ช่วยให้คุณรับและแสดงการแจ้งเตือนแบบเรียลไทม์บนหน้าเว็บทุกครั้งที่ Webhook ถูกเรียกใช้.
