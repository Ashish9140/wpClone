const ChatModal = require('./models/chat-data');
function Socket(io) {
    io.on("connection", (socket) => {
        console.log("new user " + socket.id);
        socket.on('join_room', (data) => {
            socket.join(data);
            console.log(`User With Id: ${socket.id} joined room: ${data}`);
        })

        socket.on("send_message", (data) => {
            // console.log(data);
            console.log(data);
            ChatModal.create(data);
            socket.to(data.room).emit('receive_message', data)
        })

        socket.on("disconnect", () => {
            console.log(`user leaved ${socket.id}`);
        })
    });
}

module.exports = Socket;