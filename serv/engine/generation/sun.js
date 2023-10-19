const config = require("../../../config.js");
const { sun } = require(config.HELPERS + "/db.js");

const generate = async (name ,x, y , temperature , diameter) => {
    try {
        const s = await sun.create({
            name, x , y , temperature , diameter
        });
        if (s) return s;
        else return false;
    } catch (err) {
        return false;
    }
};

module.exports = generate;