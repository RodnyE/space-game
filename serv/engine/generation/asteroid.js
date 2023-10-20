const config = require("../../../config.js");
const { Asteroid } = require(config.HELPERS + "/db.js");

const generate = async (name ,x, y , pos_x , pos_y ,diameter) => {
    try {
        const s = await Asteroid.create({
            name, x , y , pos_x , pos_y ,diameter
        });
        if (s) return s;
        else return false;
    } catch (err) {
        return false;
    }
};

module.exports = generate;