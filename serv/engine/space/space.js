const config = require("../../../config.js");
const nameGen = require("../generation/nameGen.js");
const { Player, SpaceZone } = require(config.HELPERS + "/db.js");

class _Space {
    constructor(g){
        this.g = g;
        this.space = {};
        this.pj_changes = {};
        this.players = {};
    }

    async config (){
        const c = Math.ceil(Math.sqrt(await SpaceZone.count()));
        this.space[-1 + "_" + -1] = {};
        for(let x = 0; x < c ; x++){
            for(let y = 0; y < c ; y++){
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
        player.setEnableMove(()=> {
            player.s.on("move" , (data)=> {
                if(data.x && data.y) {
                    player.pos = data;
                    this.space[space][player.name].pos = data;
                    if(!this.pj_changes[space][player.name]) this.pj_changes[space][player.name] = {pos:data};
                    else this.pj_changes[space][player.name] = {pos:data};
                }
            });
        });
        await player.joinSpace(space_pos.x , space_pos.y);
        player.BroadcastToRoom("player_join" , {
            name: player.name,
            pos: player.pos,
            ang: 180
        });
        
    }

    Loop(fps) {
        //Game Loop
        setInterval(() => {
            
            for (let m in this.pj_changes) {
                this.g.BroadcastToRoom(m, 'pj_changes', this.pj_changes[m]); //sending players pj_changes to area
            }
            this.pj_changes = {}; //restart the var
        }, 1000 / fps || 30);
    }

    async ResourcesLoop(time) {

    }


}

module.exports = _Space;