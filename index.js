var http  = require('http'),
    fs    = require('fs');

var server = http.createServer();
server.on('request', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(fs.readFileSync("./views/index.html"));
});

var io = require('socket.io')(server);
io.on('connection', socket => {
  socket.on('disconnect', () => {
    console.log("disconnected! " + socket.id);
  });

  socket.emit('greeting', {message: 'hello'}, data => {
    console.log(socket.id + ' result: ' + data);
  });
  socket.on('request', msg => {
    console.log(msg);
    socket.emit('response', {
      message: "response message",
      status: 200,
      file: "index.js"
    });
  });
});

server.listen(8000);
