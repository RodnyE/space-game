const config = require("../../../config.js");
const { Sun } = require(config.HELPERS + "/db.js");

const generate = async (name , spacezone_id , x, y ,temperature , diameter) => {
    try {
        const s = await Sun.create({
            name, spacezone_id , x , y ,temperature , diameter
        });
        if (s) return s;
        else return false;
    } catch (err) {
        return false;
    }
};

module.exports = generate;