const config = require("../../../config.js");
const { Planet } = require(config.HELPERS + "/db.js");

const generate = async (name ,x, y ,pos_x , pos_y , temperature , diameter) => {
    try {
        const s = await Planet.create({
            name, x , y , pos_x , pos_y , temperature , diameter
        });
        if (s) return s;
        else return false;
    } catch (err) {
        return false;
    }
};

module.exports = generate;