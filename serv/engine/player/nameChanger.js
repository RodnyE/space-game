const config = require("../../../config.js");
const {Player} = require(config.HELPERS + "/db.js");
module.exports = (player) => {
    player.On("change_name", async (data) => {
        if(player.space_pos.x == -1 && player.space_pos.y == -1 && typeof(data) == "String"){
            const p = await Player.findOne({
                where: {
                    user_id: player.id
                }
            });

            if(!p) return;
            //p.update()
        }
    });
}