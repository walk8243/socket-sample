var io  = require('socket.io-client');

var url = 'http://localhost:8000';

var socket = io(url);
socket.on('connect', data => {
  console.log('connect');
});
