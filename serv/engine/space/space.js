const config = require("../../../config.js");
const nameGen = require("../generation/nameGen.js");
const { Player, SpaceZone } = require(config.HELPERS + "/db.js");

class _Space {
    constructor(g) {
        this.g = g;
        this.space = {};
        this.pj_changes = {};
        this.players = {};
    }

    async config() {
        const c = Math.ceil(Math.sqrt(await SpaceZone.count()));
        this.space[-1 + "_" + -1] = {};
        this.pj_changes[-1 + "_" + -1] = {};
        for (let x = 0; x < c; x++) {
            for (let y = 0; y < c; y++) {
                this.space[x + "_" + y] = {};
                this.pj_changes[x + "_" + y] = {};
            }
        }
    }

    async addPlayer(player) {
        this.players[player.id] = player;
        const space_pos = player.space_pos;
        const space = space_pos.x + "_" + space_pos.y;
        this.space[space][player.name] = {
            pos: player.pos,
            ang: 180
        };
        player.setEnableMove(() => {
            player.s.on("move", (data) => {
                if (player.canMove && data.x && data.y) {
                    player.pos = data;
                    this.space[space][player.name].pos = data;
                    if (!this.pj_changes[space][player.name]) this.pj_changes[space][player.name] = { pos: data };
                    else this.pj_changes[space][player.name] = { pos: data };
                }
            });
        });
        await player.joinSpace(space_pos.x, space_pos.y , this.space);
        player.BroadcastToRoom("player_join", {
            name: player.name,
            pos: player.pos,
            ang: 180
        });

        player.s.on("disconnect" , async (data) => {
            player.leaveSpace();
            const p = await Player.findOne({where: {user_id: player.id}});
            if(p){
                await p.update({
                    pos: player.pos,
                    space_pos: player.space_pos
                });
            }
            delete this.players[player.id];

        });

    }
    

    Loop(fps) {

        const isEmptyObject = (obj) => {
            return Object.values(obj).length === 0;
        }
        //Game Loop
        setInterval(() => {
            const pj_changes = { ...this.pj_changes };
            for (let m in pj_changes) {
                if (isEmptyObject(pj_changes[m])) continue;
                this.g.BroadcastToRoom(m, 'pj_changes', pj_changes[m]); //sending players pj_changes to area
                this.pj_changes[m] = {}
            }
            //this.pj_changes = {}; //restart the var
        }, 1000 / fps || 30);
    }

    async ResourcesLoop(time) {

    }


}

module.exports = _Space;