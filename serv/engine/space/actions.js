const config = require("../../../config.js");
const uid = require(config.HELPERS + "/uid.js");
const {Rand} = require(config.HELPERS + "/maths.js");
const { SpaceZone, Planet, Op } = require(config.HELPERS + "/db.js");

let items = {};

const setItems = (_items) => {
    items = _items;
}

class Action {
    constructor(id) {
        this.id = id;
        this.types = ["TERRAFORM", "COLONIZATION"];
    }

    typeOfAction() {
        switch (true) {
            case this.id.includes("tm"):
                return this.types[0];

            case this.id.includes("cm"):
                return this.types[1];

            default:
            // handle unexpected case
        }
    }

    async executeItem(player, g) {
        const space_pos = player.space_pos;
        const pos = player.pos;

        if (!player.inventory.hasItem(this.id)) {
            return player.Emit("toast", { status: false, message: "ITEM_NOT_FOUND" });
        }
        let space , planets , found;
        switch (this.typeOfAction()) {
            case this.types[0]: // TERRAFORM action
                space = await SpaceZone.findOne({ where: { x: space_pos.x, y: space_pos.y } });
                if (!space) {
                    console.error("Space not found");
                    return player.Emit("toast", { status: false, message: "SPACE_NOT_FOUND" });
                }

                planets = await Planet.findAll({ where: { spacezone_id: space.id } });
                found = null;

                // Iterate through planets to find the one at player's position
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

                // Check if a planet is found at the player's position
                if (!found) {
                    return player.Emit("toast", { status: false, message: "PLANET_NOT_FOUND" });
                }

                // Check if the planet is already terraforming
                if (found.isTerraforming) {
                    return player.Emit("toast", { status: false, message: "PLANET_ALREADY_TERRAFORMING" });
                }

                // Check if the planet is already colonized
                if (found.owner) {
                    return player.Emit("toast", { status: false, message: "PLANET_ALREADY_COLONIZED" });
                }

                // Check if the required item exists
                if (items[this.id]) {
                    const item = items[this.id];

                    // Check terraforming conditions
                    if (found.temperature > item.temperature) {
                        return player.Emit("toast", { status: false, message: "INSUFFICIENT_LEVEL_OF_TERRAFORMER" });
                    }
                    if (item.require.energy > player.stats.energy) {
                        return player.Emit("toast", { status: false, message: "INSUFFICIENT_ENERGY" });
                    }

                    // Update player stats and inventory
                    player.stats.energy -= item.require.energy;
                    player.inventory.deleteItem(this.id, 1);
                    player.Emit("pj_change", { stats: player.stats });

                    const terraformDuration = 60;
                    const tickInterval = 1000;

                    let remainingTime = terraformDuration;

                    // Broadcast terraforming progress to the room
                    g.BroadcastToRoom(space_pos.x + "_" + space_pos.y, "space_change", { name: found.name, isTerraforming: 60 });

                    // Set planet to terraforming
                    found.isTerraforming = remainingTime;
                    await found.save();

                    // Execute terraforming with a timer
                    const tick = setInterval(async () => {
                        remainingTime--;

                        found.isTerraforming = remainingTime;

                        if (remainingTime <= 0) {
                            clearInterval(tick);
                            found.isTerraforming = 0; // Set terraforming to 0 instead of false
                            found.temperature = Rand(-30 , 30);

                            // Broadcast terraforming completion to the room
                            g.BroadcastToRoom(space_pos.x + "_" + space_pos.y, "space_change", { name: found.name, isTerraforming: 0 });

                            // Save the updated planet information
                            await found.save();

                            // Inform the player about terraforming completion
                            player.Emit("toast", { status: true, message: "TERRAFORMATION_COMPLETED" });
                        }
                    }, tickInterval);
                } else {
                    // Item not found in items database
                    return player.Emit("toast", { status: false, message: "ITEM_NOT_FOUND" });
                }
                break;

            case this.types[1]: // COLONIZATION action
                space = await SpaceZone.findOne({ where: { x: space_pos.x, y: space_pos.y } });
                if (!space) {
                    console.error("Space not found");
                    return player.Emit("toast", { status: false, message: "SPACE_NOT_FOUND" });
                }

                planets = await Planet.findAll({ where: { spacezone_id: space.id } });
                found = null;

                // Iterate through planets to find the one at player's position
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

                // Check if a planet is found at the player's position
                if (!found) {
                    return player.Emit("toast", { status: false, message: "PLANET_NOT_FOUND" });
                }

                // Check if the planet is already colonized
                if (found.owner) {
                    return player.Emit("toast", { status: false, message: "PLANET_ALREADY_COLONIZED" });
                }

                // Check if the planet is already in the process of terraforming
                if (found.isTerraforming != 0) {
                    return player.Emit("toast", { status: false, message: "PLANET_TERRAFORMING" });
                }

                // Check if the planet is already in the process of colonizing
                if (found.isColonizing != 0) {
                    return player.Emit("toast", { status: false, message: "PLANET_COLONIZING" });
                }

                // Check if the temperature of the planet is in the suitable range for colonization
                if (found.temperature < -30 || found.temperature > 30) {
                    return player.Emit("toast", { status: false, message: "UNSUITABLE_TEMPERATURE_FOR_COLONIZATION" });
                }

                // Check if the required item exists
                if (items[this.id]) {
                    const item = items[this.id];

                    // Check colonization conditions
                    if (item.require.energy > player.stats.energy) {
                        return player.Emit("toast", { status: false, message: "INSUFFICIENT_ENERGY" });
                    }

                    // Update player stats and inventory
                    player.stats.energy -= item.require.energy;
                    player.inventory.deleteItem(this.id, 1);
                    player.Emit("pj_change", { stats: player.stats });

                    // Set the duration and time interval for colonization
                    const colonizationDuration = 60;
                    const tickInterval = 1000;

                    let remainingTime = colonizationDuration;

                    // Broadcast colonization progress to the room
                    g.BroadcastToRoom(space_pos.x + "_" + space_pos.y, "space_change", { name: found.name, isColonizing: 60 });

                    // Set the planet to the colonizing state
                    found.isColonizing = remainingTime;
                    await found.save();

                    // Execute colonization with a timer
                    const tick = setInterval(async () => {
                        remainingTime--;

                        found.isColonizing = remainingTime;

                        if (remainingTime <= 0) {
                            clearInterval(tick);
                            found.isColonizing = 0; // Set colonization to 0 
                            found.owner = player.id;

                            // Broadcast colonization completion to the room
                            g.BroadcastToRoom(space_pos.x + "_" + space_pos.y, "space_change", { name: found.name, isColonizing: 0 });

                            // Save the updated planet information
                            await found.save();

                            // Inform the player about colonization completion
                            player.Emit("toast", { status: true, message: "COLONIZATION_COMPLETED" });
                        }
                    }, tickInterval);
                } else {
                    // Item not found in items database
                    return player.Emit("toast", { status: false, message: "ITEM_NOT_FOUND" });
                }
                break;

            default:
                // handle unexpected case
                break;
        }
    }
}

module.exports = { setItems, Action };
