const config = require("../../../config.js");
const nameGen = require("../generation/nameGen.js");
const { Player, SpaceZone } = require(config.HELPERS + "/db.js");

class _Space {
    constructor(g){
        this.g = g;
        this.space = {}
    }

    async config (){
        const c = Math.ceil(Math.sqrt(await SpaceZone.count()));
        for(let x = 0; x < c ; x++){
            for(let y = 0; y < c ; y++){
                this.space[x + "_" + y] = {};
            }
        }
    }


}