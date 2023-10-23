const _Player = require("./player/player.js");

const Socket = (io) => {
    const sw = require("./socket-w.js").g(io);
    const g = sw.CreateNamespace("/game");
    g.on("connection" , async (socket) => {
        const s = require("./socket-w.js").s(socket);
        let user_id = "xgkHNGNM";
        if ((!s.request.session || !s.request.session.passport || !s.request.session.passport.user) && !s.handshake.query.token) user_id = "pkZI01f3";//return s.disconnect();
        else if (s.handshake.query.token) user_id = s.handshake.query.token;
        else user_id = s.request.session.passport.user;
        
        console.log("Your User ID is", user_id);

        const Player = new _Player(user_id , s);
        await Player.sync();

    });
}

module.exports = Socket;