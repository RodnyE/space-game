const config = require("../../../config.js");
const nameGen = require("../generation/nameGen.js");
const { Player, SpaceZone , Planet } = require(config.HELPERS + "/db.js");
const Maths = require(config.HELPERS + "/maths.js");

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
        let space_pos = player.space_pos;
        let space = space_pos.x + "_" + space_pos.y;

        this.space[space][player.name] = {
            pos: player.pos,
            a: player.a
        };

        const changeSpaces = async (data) => {
            if(data.x < 0 || data.x > 1000 || data.y < 0 || data.y > 1000){
                let mx = (data.x < 0 ? -1 : (data.x > 1000 ? 1 : 0));
                let my = (data.y < 0 ? -1 : (data.y > 1000 ? 1 : 0));
                if(space_pos.x == -1 && space_pos.y == -1){
                    const sp = await SpaceZone.findAll({
                        where: {
                            type: "sun"
                        }
                    });
                    let c = sp.length;
                    let found = false;
                    while(found == false){
                        const s = sp[Maths.Rand(0 , c)];
                        const planets = await Planet.findAll({
                            where: {
                                spacezone_id: s.id
                            }
                        });
                        for(let planet of planets){
                            if(!planet.owner) {
                                found = s;
                                break;
                            }
                        }
                    }
                    return found;
                }else{

                }
            }
        };

        player.setEnableMove(() => {
            player.On("move", async (data) => {
                space_pos = player.space_pos;
                space = space_pos.x + "_" + space_pos.y;
                if (player.canMove && data.x && data.y) {
                    player.pos.x = data.x;
                    player.pos.y = data.y;
                    if((await changeSpaces()) == true) return;
                    this.space[space][player.name].pos = data;
                    if (!this.pj_changes[space][player.name]) this.pj_changes[space][player.name] = { pos: {x : data.x , y :data.y}};
                    else this.pj_changes[space][player.name] = { pos: {x : data.x , y :data.y}};
                    if(data.a) {
                        player.a = data.a;
                        this.pj_changes[space][player.name].a = data.a;
                    }
                }else if(player.canMove && data.a){
                    player.a = data.a;
                    this.pj_changes[space][player.name].a = data.a;
                }
            });
        });
        await player.joinSpace(space_pos.x, space_pos.y , this.space);
        player.BroadcastToRoom("player_join", {
            name: player.name,
            pos: player.pos,
            a: player.a
        });

        player.On("disconnect" , async (data) => {
            player.leaveSpace();
            const p = await Player.findOne({where: {user_id: player.id}});
            if(p){
                await p.update({
                    pos: player.pos,
                    space_pos: player.space_pos
                });
            }
            space_pos = player.space_pos;
            space = space_pos.x + "_" + space_pos.y;
            delete this.space[space][player.name];
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