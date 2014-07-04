/*
 * Serve content over a socket
 */

// export function for listening to the socket
module.exports = function (socket) {

  socket.on('create:task', function (data) {
    socket.broadcast.emit('create:task', data);
  });

  socket.on('update:task', function(data) {
    socket.broadcast.emit('update:task', data);
  });

  socket.on('delete:task', function(data) {
    socket.broadcast.emit('delete:task', data);
  });  
};