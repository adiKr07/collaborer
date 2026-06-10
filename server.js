require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');
const path = require('path');
const { execute } = require('./executor');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'collab.html'));
});

app.post('/run', async (req, res) => {
    const { code, language, input } = req.body;
    const result = await execute(code, language, input);
    res.json(result);
});

const server = http.createServer(app);

// Yjs WS on same server, different path
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', (conn, req) => setupWSConnection(conn, req));

server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Running on port ${PORT}`));