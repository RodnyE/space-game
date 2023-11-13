const config = require("../../../config.js");
const uid = require(config.HELPERS + "/uid.js");
const { SpaceZone, Planet, Op } = require(config.HELPERS + "/db.js");

let items = {};

const setItems = (_items) => {
    items = _items;
}

class Action {
    constructor(id) {
        this.id = id;
        this.types = ["TERRAFORM", "COLONIZATION"]
    }

    typeOfAction() {
        switch (true) {
            case this.id.includes("tm"):

                return this.types[0];

            case this.id.includes("cm"):

                return this.types[1];

            default:

        }
    }


    async executeItem(player, g) {
        const space_pos = player.space_pos;
        const pos = player.pos;
        if(!player.inventory.hasItem(this.id)) return player.Emit("toast", { status: false, message: "ITEM_NOT_FOUND" });
        switch (this.typeOfAction()) {
            case this.types[0]:
                const space = await SpaceZone.findOne({ where: { x: space_pos.x, y: space_pos.y } });
                if (!space) return player.Emit("toast", { status: false, message: "SPACE_NOT_FOUND" });
                const planets = Planet.findAll({ where: { spacezone_id: space.id } });
                const found = null;
                for (let planet of planets) {
                    const radius = planet.diameter / 2;
                    const min_x = planet.x - radius,
                        max_x = planet.x + radius,
                        min_y = planet.y - radius,
                        max_y = planet.y + radius;

                    if (pos.x > min_x && pos.x < max_x && pos.y > min_y && pos.y < max_y) {
                        found = planet;
                        break;
                    }
                }
                if (!found) return player.Emit("toast", { status: false, message: "PLANET_NOT_FOUND" });
                if (found.owner) return player.Emit("toast", { status: false, message: "PLANET_ALREADY_COLONIZED" });
                if (items[this.id]) {
                    const item = items[this.id];
                    if (found.temperature > item.temperature) return player.Emit("toast", { status: false, message: "INSUFICIENT_LEVEL_OF_TERRAFORMER" });
                    if (item.require.energy > player.stats.energy) return player.Emit("toast", { status: false, message: "INSUFICIENT_ENERGY" });
                    
                    player.stats.energy -= item.require.energy;
                    player.inventory.deleteItem(this.id , 1);
                    player.Emit("pj_change" , {stats: player.stats});
                    
                    const terraformDuration = 60; 
                    const tickInterval = 1000;

                    let remainingTime = terraformDuration;
                    g.BroadcastToRoom(space_pos.x + "_" + space_pos,y , "space_change" , {name: found.name , isTerraforming: 60});
                    const tick = setInterval(async () => {
                        remainingTime--;
               
                        found.isTerraforming = remainingTime;

                        if (remainingTime <= 0) {
                            clearInterval(tick);
                            found.isTerraforming = false;
                            found.owner = player.id; 
                            g.BroadcastToRoom(space_pos.x + "_" + space_pos,y , "space_change" , {name: found.name , isTerraforming: 0});
                            await found.save(); 
                            player.Emit("toast", { status: true, message: "TERRAFORMATION_COMPLETED" });
                        }
                    }, tickInterval);
                } else return player.Emit("toast", { status: false, message: "ITEM_NOT_FOUND" });
                break;
        }
    }
}


module.exports = { setItems, Action };