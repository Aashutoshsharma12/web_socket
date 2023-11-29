const express = require('express');
const app = express();
require('dotenv').config();
// const OpenAIAPI = require('openai');
// const apiKey = process.env.OPENAI_API_KEY;
// const openai = new OpenAIAPI({ key: apiKey });
// console.log(apiKey)
// async function runCompletion() {
//     try {
//         const prompt = 'How are you today?';
//         // const response = await openai.createCompletion({
//         //     // engine: 'gpt-3.5-turbo',
//         //     prompt,
//         //         model:"gpt-3.5-turbo",
//         //     // messages: [{role: "user", content:"Hello"}],
//         // });
//         // const chatCompletion = await openai.chat.completions.create({
//         //     messages: 
//         //     model: 'gpt-3.5-turbo',
//         // });

//         console.log(chatCompletion.choices[0].text);
//     } catch (error) {
//         console.error('Error:', error.message || error);
//     }
// }
// runCompletion();
// app.listen(30123, () => {
//     console.log('Server is running on 30123');
// });

// const OpenAI = require('openai');const openai = new OpenAI({ key: apiKey });
// async function main() {
//     const completion = await openai.chat.completions.create({
//         messages: [{ "role": "system", "content": "You are a helpful assistant." },
//         { "role": "user", "content": "Who won the world series in 2020?" },
//         { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020." },
//         { "role": "user", "content": "Where was it played?" }],
//         model: "text-davinci-003",
//     });

//     console.log(completion.choices[0]);
// }
// main();

// const WebSocket = require('ws');
// const server1 = new WebSocket.Server({ port: 3000 });

// server1.on('connection', (socket) => {
//     console.log('Client connected');

//     // Handle messages from clients
//     socket.on('message', (message) => {
//         console.log(`Received: ${message}`);

//         // Send a response back to the client
//         socket.send('Hello from the server HOw are you!');
//     });

//     // Handle disconnection
//     socket.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index1.html');
});
// wss.on('connection', (ws) => {
//   // Handle WebSocket connection
//   console.log('Client connected');

//   // Listen for messages from the client
//   ws.on('message', (message) => {
//     console.log(`Received message: ${message}`);

//     // Send a response back to the client
//     ws.send('Server received your message: ' + "hii client");
//   });

//   // Listen for the WebSocket connection to close
//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });
// app.use(express.static('public/index.html'));
const clients = new Map(); // Map to store WebSocket connections

wss.on('connection', (ws) => {
    // Handle WebSocket connection
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(data,"recieving------")
        // Check the message type
        switch (data.type) {
            case 'join':
                // Store the WebSocket connection in the specified room
                const room = data.room;
                console.log(room,"ekkkdkd")
                if (!clients.has(room)) {
                    clients.set(room, new Set());
                }
                clients.get(room).add(ws);
                break;
            case 'message':
                // Broadcast the message to all clients in the same room
                const roomClients = clients.get(data.room);
                if (roomClients) {
                    roomClients.forEach((client) => {
                        client.send(data.message);
                        console.log(data.message,"sending-----")
                    });
                }
                break;
            default:
                console.error('Unknown message type:', data.type);
        }
    });

    // Listen for the WebSocket connection to close
    ws.on('close', () => {
        console.log('Client disconnected');

        // Remove the disconnected WebSocket connection from all rooms
        clients.forEach((roomClients, room) => {
            roomClients.delete(ws);
            if (roomClients.size === 0) {
                clients.delete(room);
            }
        });
    });
});

server.listen(30010, () => {
    console.log('Server is running on http://localhost:30010');
});



