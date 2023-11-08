// Import the configuration and the Player model from relative paths.
const config = require("../../../config.js");
const { Player } = require(config.HELPERS + "/db.js");

// Export a module that handles the "change_name" event for a player in a specific space.
module.exports = (player, space) => {
    player.On("change_name", async (data) => {
        // Check if the player is in a special location (x: -1, y: -1) and if "data" is a string.
        if (player.space_pos.x == -1 && player.space_pos.y == -1 && typeof (data) == "string") {
            // Search for the player in the database by their "user_id".
            const p = await Player.findOne({
                where: {
                    user_id: player.id
                }
            });

            // If the player is not found in the database, stop the process.
            if (!p) return;

            // Check if a player with the new name already exists in the database.
            const exist = await Player.findOne({
                where: {
                    name: data
                }
            });

            // If a player with the same name already exists, stop the process.
            if (exist) return player.Emit("change_name", "NAME_EXISTS");

            // Verify if the length of the new name is within the allowed range (between 4 and 16 characters).
            if (data.length > 16 || data.length < 4) return player.Emit("change_name", "NAME_LENGTH");

            // Update the player's name in the database with the provided new name.
            await p.update({
                name: data
            });

            // The player leaves their current space.
            player.leaveSpace(space);

            // Update the player's name with the new name.
            player.name = data;

            // The player joins the same space with the new name in the special location (x: -1, y: -1).
            player.joinSpace(-1, -1, space);
        }
    });
}