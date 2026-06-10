const http = require('http');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
    setupWSConnection(conn, req);
});

server.listen(1234, () => {
    console.log('Yjs WS server on port 1234');
});