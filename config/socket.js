module.exports = (app, io) => {

  io.on('connection', (socket) => {
    console.log("connection -==");
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
      socket.join(data)
      console.log(`User with ID: ${socket.id} joined Room: ${data}  `);
    });

    socket.on("send_message", (data) => {
      console.log(`message: ${JSON.stringify(data)}  `);
      socket.to(data.room).emit("receive_message", data)
    })

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    })

  });
};
