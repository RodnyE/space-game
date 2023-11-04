const config = require("../../../config.js");
const {Player} = require(config.HELPERS + "/db.js");
module.exports = (player , space) => {
    player.On("change_name", async (data) => {
        if(player.space_pos.x == -1 && player.space_pos.y == -1 && typeof(data) == "string"){
            const p = await Player.findOne({
                where: {
                    user_id: player.id
                }
            });

            if(!p) return;
            await p.update({
                name: data
            });
            player.leaveSpace(space);
            player.name = data;
            player.joinSpace(-1 , -1 , space);
        }
    });
}