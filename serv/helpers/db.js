const config = require("../../config.js");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const UserModel = require("./models/user.js");
const uid = require("./uid.js");
const SpaceZoneModel = require("./models/spaceZone.js");
const SunModel = require("./models/sun.js");
const PlanetModel = require("./models/planet.js");
const AsteroidModel = require("./models/asteroid.js");
const BlackHoleModel = require("./models/blackHole.js");

/**********************
 * Starting Connection *
 **********************/
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.DB + '/db.sqlite',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
    } catch (err) {
        throw new Error("" + err)
    }
})();

/*********************
 *   User Model DB   *
 *********************/
class User extends Model {
    getData() {
        const rows = ["user_id", "username", "acclevel"];
        let ret = {};
        for (let row of rows) {
            if (this[row]) {
                try {
                    ret[row] = JSON.parse(this[row]);
                } catch (err) {
                    ret[row] = this[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this[o] == undefined) continue;
            parsedObj[o] = (typeof (obj) === "object" ? JSON.stringify(obj[o]) : obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.err(err);
            return false;
        }
    }
}

User.init(
    UserModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await User.sync();
})();


/*********************
 *   SpaceZone Model DB   *
 *********************/
class SpaceZone extends Model {
    getData(r) {
        const rows = r || [];
        let ret = {};
        for (let row of rows) {
            if (this[row]) {
                try {
                    ret[row] = JSON.parse(this[row]);
                } catch (err) {
                    ret[row] = this[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this[o] == undefined) continue;
            parsedObj[o] = (typeof (obj) === "object" ? JSON.stringify(obj[o]) : obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.err(err);
            return false;
        }
    }
}

SpaceZone.init(
    SpaceZoneModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await SpaceZone.sync();
})();

/*********************
 *  Sun Model DB   *
 *********************/
class Sun extends Model {
    getData(r) {
        const rows = r || [];
        let ret = {};
        for (let row of rows) {
            if (this[row]) {
                try {
                    ret[row] = JSON.parse(this[row]);
                } catch (err) {
                    ret[row] = this[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this[o] == undefined) continue;
            parsedObj[o] = (typeof (obj) === "object" ? JSON.stringify(obj[o]) : obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.err(err);
            return false;
        }
    }
}

Sun.init(
    SunModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await Sun.sync();
})();


/*********************
 *  Planet Model DB   *
 *********************/
class Planet extends Model {
    getData(r) {
        const rows = r || [];
        let ret = {};
        for (let row of rows) {
            if (this[row]) {
                try {
                    ret[row] = JSON.parse(this[row]);
                } catch (err) {
                    ret[row] = this[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this[o] == undefined) continue;
            parsedObj[o] = (typeof (obj) === "object" ? JSON.stringify(obj[o]) : obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.err(err);
            return false;
        }
    }
}

Planet.init(
    PlanetModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await Planet.sync();
})();

/*********************
 *  Asteroid Model DB   *
 *********************/
class Asteroid extends Model {
    getData(r) {
        const rows = r || [];
        let ret = {};
        for (let row of rows) {
            if (this[row]) {
                try {
                    ret[row] = JSON.parse(this[row]);
                } catch (err) {
                    ret[row] = this[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this[o] == undefined) continue;
            parsedObj[o] = (typeof (obj) === "object" ? JSON.stringify(obj[o]) : obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.err(err);
            return false;
        }
    }
}

Asteroid.init(
    AsteroidModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await Asteroid.sync();
})();

/*********************
 *  BlackHole Model DB   *
 *********************/
class BlackHole extends Model {
    getData(r) {
        const rows = r || [];
        let ret = {};
        for (let row of rows) {
            if (this[row]) {
                try {
                    ret[row] = JSON.parse(this[row]);
                } catch (err) {
                    ret[row] = this[row];
                }
            }
        }
        return ret;
    }

    async setData(obj) {
        let parsedObj = {};
        for (let o in obj) {
            if (this[o] == undefined) continue;
            parsedObj[o] = (typeof (obj) === "object" ? JSON.stringify(obj[o]) : obj[o]);
        }
        try {
            await this.update(parsedObj);
            return true;
        } catch (err) {
            console.err(err);
            return false;
        }
    }
}

BlackHole.init(
    BlackHoleModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await BlackHole.sync();
})();

module.exports = {
    User,
    SpaceZone,
    Sun,    
    Planet,
    Asteroid,
    BlackHole,
    Op
};