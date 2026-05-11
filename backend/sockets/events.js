export const setupSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('message', (data) => {
      console.log(`Message from ${socket.id}:`, data);
      io.emit('message', { from: socket.id, data });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
