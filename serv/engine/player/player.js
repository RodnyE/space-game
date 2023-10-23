const config = require("../../../config.js");
const nameGen = require("../generation/nameGen.js");
const { Player, SpaceZone } = require(config.HELPERS + "/db.js");
class _Player {
    constructor(id, s) {
        this.id = id;
        this.name;
        this.s = s;
        this.pos;
        this.space_pos;
    }

    async sync() {
        let [pj , created] = await Player.findOrCreate({
            where: {
                user_id: this.id
            },
            defaults: {
                name: nameGen("ship"),
                user_id: this.id
              }
        });
        if(!pj && !created) return;
        pj = pj || created;
        this.name = pj.name;
        this.pos = pj.pos;
        this.space_pos = pj.space_pos;
        await this.sendData();
    }

    async sendData() {

        this.s.emit("player_data", { name: this.name, pos: this.pos })
    }
}

module.exports = _Player;