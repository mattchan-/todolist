/*
 * Serve content over a socket
 */

var io = require('socket.io');

// export function for listening to the socket
exports.socketHandler = function (socket) {

  socket.on('create:task', function (data) {
    socket.broadcast.emit('create:task', data);
  });

  socket.on('update:task', function(data) {
    socket.broadcast.emit('update:task', data);
  });

  socket.on('delete:task', function(data) {
    socket.broadcast.emit('delete:task', data);
  });

  socket.on('webhook', function(data) {
    socket.broadcast.emit('webhook', data);
  });
};

exports.init = function(server) {
  exports.io = io(server);
  //  Socketio setup
};