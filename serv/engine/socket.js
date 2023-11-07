const _Player = require("./player/player.js");
const _Space = require("./space/space.js");


const Socket = async (io) => {
    const g = require("./socket-w.js").g(io);
    const Space = new _Space(g);
    await Space.config();
    Space.Loop(15);
    g.on("connection" , async (socket) => {
        const s = require("./socket-w.js").s(socket);
        let user_id = "xgkHNGNM";
        if ((!s.request.session || !s.request.session.passport || !s.request.session.passport.user) && s.handshake.query.token == undefined) user_id = "pkZI01f3";//return s.disconnect();
        else if (s.handshake.query.token) user_id = s.handshake.query.token;
        else user_id = s.request.session.passport.user;
        
        console.log("Your User ID is", user_id);

        const Player = new _Player(user_id , s);
        await Player.sync();

        Space.addPlayer(Player);

    });
}

module.exports = Socket;