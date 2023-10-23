module.exports = {
    g: (io) => {
        io.Broadcast = (event, message) => {
            io.emit(event, message);
        }

        io.BroadcastToRoom = (room, event, message) => {
            io.in(room).emit(event, message);
        }

        io.CreateNamespace = (namespace) => {
            io = io.of("/world");
            io.Broadcast = (event, message) => {
                io.of(namespace).emit(event, message);
            }
            io.BroadcastToRoom = (room, event, message) => {
                io.of(namespace).in(room).emit(event, message);
            }
            return io;
        }
        return io;
    },
    s: (socket) => {

        return socket;
    }
}