const express = require('express');
const bodyParser = require('body-parser');
const invitesRouter = require('./routes/invites')
const friendsRouter = require('./routes/friends')
const usersRouter = require('./routes/users')
const locationsRouter = require('./routes/locations')
const authRouter = require('./routes/auth')
const {auth} = require('./middleware')
const {init_ws, WS} = require('./network/ws')
const init = require("./db/init_db");
const favicon = require('serve-favicon');
const app = express();
const server = require('http').createServer(app);

const wss = init_ws(server);


app.use(express.json())
app.use(bodyParser.json());
app.use(favicon(__dirname + '/public/images/favicon.ico'));

init.createTables();

app.get('/', (req, res) => {
  init.createTables();
  if (wss) {
    wss.on('connection', (ws_socket) => {
        ws_socket.send('New Message via websocket'); 
    });   
  }
  //res.send('Welcome to kaquiz api'); 
  res.send(
    `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>WS TEST</title>   
        </head>
        <body>
          <input type="submit" value="WS test" id="submit">

          <script>
              console.log('test js')
              const socket = new WebSocket('ws://localhost:3000')
              socket.addEventListener('open', e => {
                  console.log('connection opened...');
              });
              socket.addEventListener('message', e => {
                  console.log('incoming message: ' + e.data);
              });
              const btn = document.querySelector('input');
              btn.addEventListener('click', () => {
                 fetch("http://localhost:3000/", {
                    method: "POST",
                    body: JSON.stringify({}),
                    headers: {
                      "Content-type": "application/json; charset=UTF-8"
                    }
                  })
                    .then((response) => response.json())
                    .then((json) => console.log(json));
              })

          </script>
        </body>
      </html>
    `
  ); 
});

app.post('/', (req, res) => {
  console.log("wss "+ wss);
  if (wss) {
    wss.clients.forEach(function each(client) {
      client.send('POST request. New Message via websocket');
   });

  }
  res.status(200).send('{"status": "OK"}');
})

app.use(auth);

app.use('/auth', authRouter)

app.use('/invites', invitesRouter)
app.use('/friends', friendsRouter)
app.use('/users', usersRouter)
app.use('/locations', locationsRouter)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});