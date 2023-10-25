const config = require("../../../config.js");
const nameGen = require("../generation/nameGen.js");
const Maths = require(config.HELPERS + "/maths.js");
const { Player, SpaceZone , Sun , Asteroid , Planet , BlackHole} = require(config.HELPERS + "/db.js");
class _Player {
    constructor(id, s) {
        this.id = id;
        this.name;
        this.s = s;
        this.pos;
        this.space_pos;
        this.enableMove;
        this.canMove = false;
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
        //await this.sendSpaceData();
    }

    async sendData() {

        await this.s.emit("player_data", { name: this.name, pos: this.pos });
    }

    async sendSpaceData() {
        const {x , y} = this.space_pos;
        const space = await SpaceZone.findOne({
            where: {
                x , y
            }
        });
        if(space){
            let suns , planets , asteroids , blackholes;
            suns = await Sun.findAll({
                attributes: ["name" , "x" , "y","temperature" , "diameter"],
                where: {
                    spacezone_id: space.id
                }
            });
            planets = await Planet.findAll({
                attributes: ["name" , "x" , "y","temperature" , "diameter" ],
                where: {
                    spacezone_id: space.id
                }
            });
            asteroids = await Asteroid.findAll({
                attributes: ["name" , "x" , "y" ,"diameter"],
                where: {
                    spacezone_id: space.id
                }
            });
            blackholes = await BlackHole.findAll({
                attributes: ["name" , "x" , "y"  , "diameter"],
                where: {
                    spacezone_id: space.id
                }
            });

            this.s.emit("space_data" , {name:space.name , suns , planets ,asteroids , blackholes});
        }
    }

    sendPlayersData(space){
        this.s.emit("players_data" , space[this.space_pos.x + "_" + this.space_pos.y]);
    }

    async joinSpace(x , y , space){
        this.s.join(x + "_" + y);
        this.space_pos = {x , y};
        await this.sendSpaceData();
        this.sendPlayersData(space);
        //if(x != -1 && y != -1) 
        this.enableMove();
        this.canMove = true;
    }

    leaveSpace(){
        this.BroadcastToRoom("player_leave" , this.name);
        this.s.leave(this.space_pos.x + "_" + this.space_pos.y);
        this.canMove = false;
    }

    async changeSpace(pos , space_pos){
        this.leaveSpace();
        this.pos = pos;
        await this.sendData();
        await this.joinSpace(space_pos.x , space_pos.y);
    }

    BroadcastToRoom(event, message) {
        this.s.to(this.space_pos.x + "_" + this.space_pos.y).emit(event, message);
    }

    setEnableMove (call) {
        this.enableMove = call;
    }
    
}

module.exports = _Player;