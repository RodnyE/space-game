const config = require("../../../config.js");
const { SpaceZone } = require(config.HELPERS + "/db.js");

const generate = async (name ,x, y ,type) => {
    try {
        const sz = await SpaceZone.create({
            name, x , y , type
        });
        if (sz) return sz;
        else return false;
    } catch (err) {
        console.log(err);
        return false;
    }
};

module.exports = generate;