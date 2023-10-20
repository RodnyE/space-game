const config = require("../../../config.js");
const { BlackHole } = require(config.HELPERS + "/db.js");

const generate = async (name ,x, y , pos_x , pos_y ,diameter) => {
    try {
        const s = await BlackHole.create({
            name, x , y , pos_x , pos_y , diameter
        });
        if (s) return s;
        else return false;
    } catch (err) {
        return false;
    }
};

module.exports = generate;