const config = require("../../../config.js");
const nameGen = require("../generation/nameGen.js");
const Maths = require(config.HELPERS + "/maths.js");
const { Player, SpaceZone , Sun , Asteroid , Planet , BlackHole} = require(config.HELPERS + "/db.js");
const Inventory = require("./inventory.js");
class _Player {
    constructor(id, s) {
        this.id = id;
        this.name;
        this.s = s;
        this.pos;
        this.a = 0;
        this.space_pos;
        this.enableMove;
        this.canMove = false;
        this.canSpaceWrap = false;
        this.inventory = [];
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
        this.inventory = new Inventory(pj.inventory);
    }

    async sendData() {

        await this.s.emit("player_data", { name: this.name, pos: this.pos ,a: this.a , inventory: this.inventory.getInventory()});
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
        let pd = {...space[this.space_pos.x + "_" + this.space_pos.y]};
        if(pd[this.name]) delete pd[this.name];
        this.s.emit("players_data" , pd);
    }

    async joinSpace(x , y , space){
        this.s.join(x + "_" + y);
        this.space_pos = {x , y};
        await this.sendSpaceData();
        await this.sendData();
        space[x + "_" + y][this.name] = {
            pos: this.pos,
            a: this.a
        };
        this.sendPlayersData(space);
        this.BroadcastToRoom("player_join", {
            name: this.name,
            pos: this.pos,
            a: this.a
        });
        //if(x != -1 && y != -1) 
        //this.enableMove();
        this.canMove = true;
        this.canSpaceWrap = true;
    }

    leaveSpace(space){
        this.BroadcastToRoom("player_leave" , this.name);
        const sp = this.space_pos.x + "_" + this.space_pos.y;
        this.s.leave(sp);
        if(space[sp][this.name]) delete space[sp][this.name];
        this.canMove = false;
        this.canSpaceWrap = false;
    }

    async changeSpace(pos , space_pos , space){
        await this.leaveSpace(space);
        this.pos = pos;
        await this.joinSpace(space_pos.x , space_pos.y , space);
    }

    nameChange(space){
        return require("./nameChanger.js")(this , space);
    }

    BroadcastToRoom(event, message) {
        this.s.to(this.space_pos.x + "_" + this.space_pos.y).emit(event, message);
    }

    Emit(event , message){
        this.s.emit(event , message);
    }

    On(event , callback){
        this.s.on(event , callback);
    }

    setEnableMove (call) {
        this.enableMove = call;
    }
    
}

module.exports = _Player;