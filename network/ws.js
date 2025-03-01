const { WebSocketServer } = require('ws');

const init_ws = (server)  => {
    const wss = new WebSocketServer({server});

    wss.on('connection', function connection(ws) {        
        ws.on('error', console.error);
        ws.send('ws connection seccessful...');
      });   
    return wss;
}

module.exports = {
    init_ws
}

