module.exports = (io) => {
    io.Broadcast = (event , message) => {
        io.emit(event, message);
    }

    io.BroadcastToRoom = (room , event , message) => {
        io.in(room).emit(event , message);
    }

    io.CreateNamespace = (namespace) => {
        io.Broadcast = (event , message) => {
            io.of(namespace).emit(event, message);
        }
        io.BroadcastToRoom = (room , event , message) => {
            io.of(namespace).in(room).emit(event , message);
        }
        return io;
    }
    return io;
}