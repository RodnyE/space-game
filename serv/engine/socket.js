const Socket = (io) => {
    const sw = require("./socket-w.js")(io);
    const w = sw.CreateNamespace("/world");
    w.of("/world").on("connection" , async (socket) => {
        console.log("User connected to world");
    });
}

module.exports = Socket;