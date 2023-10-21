const config = require("../../../config.js");
const { BlackHole } = require(config.HELPERS + "/db.js");

const generate = async (name ,spacezone_id , x, y ,diameter) => {
    try {
        const s = await BlackHole.create({
            name, spacezone_id, x , y , diameter
        });
        if (s) return s;
        else return false;
    } catch (err) {
        return false;
    }
};

module.exports = generate;