const config = require("../../config.js");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const UserModel = require("./models/user.js");
const uid = require("./uid.js");
const SpaceZoneModel = require("./models/spaceZone.js");
const SunModel = require("./models/sun.js");
const PlanetModel = require("./models/planet.js");
const AsteroidModel = require("./models/asteroid.js");
const BlackHoleModel = require("./models/blackHole.js");
const PlayerModel = require("./models/player.js");

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

/*********************
 *  Player Model DB   *
 *********************/
class Player extends Model {
    
}

Player.init(
    PlayerModel(DataTypes),
    {
        sequelize
    }
);

(async () => {
    await Player.sync();
})();

module.exports = {
    User,
    SpaceZone,
    Sun,    
    Planet,
    Asteroid,
    BlackHole,
    Player,
    Op
};