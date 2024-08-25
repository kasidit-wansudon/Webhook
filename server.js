const express = require('express');
const WebSocket = require('ws');

const app = express();
const wss = new WebSocket.Server({ port: 8081 });

// Middleware เพื่อแปลง JSON body
app.use(express.json());

// Endpoint สำหรับรับ Webhook POST requests
app.post('/webhook', (req, res) => {
    const data = req.body;
    console.log('Webhook received:', data);

    // ส่งข้อมูลไปยัง clients ที่เชื่อมต่อผ่าน WebSocket
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
