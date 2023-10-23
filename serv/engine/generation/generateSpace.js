const spaceZone = require("./spaceZone.js");
const sun = require("./sun.js");
const planet = require("./planet.js");
const asteroid = require("./asteroid.js");
const blackhole = require("./blackHole.js");
const nameGen = require("./nameGen.js");
const { Vector, DistanceVector, Rand } = require("../../helpers/maths.js");

const type = () => {
    let t = "empty";
    let proc = Math.round(Math.random() * 99);
    if (proc >= 0 && proc <= 8) {
        t = "empty";
    }
    else if (proc >= 9 && proc <= 20) {
        t = "blackhole";
    }
    else if (proc >= 21 && proc <= 30) {
        t = "asteroid";
    }
    else if (proc >= 31 && proc <= 100) {
        t = "sun";
    }
    return t;
};


const findSpace = (diameter, taken) => {
    let spaceFound = false;
    let counter = 0;
    let radius = diameter / 2;
    while (!spaceFound && counter < 500) {
        counter++;
        const vector = Vector(Rand(0, 999), Rand(0, 999));
        let t = false;
        for (let data of taken) {
            let oRadius = data.diameter / 2;
            let oVector = data.vector;
            if (DistanceVector(vector, oVector) < (oRadius + radius)) {
                t = true;
                break;
            }
        }
        if (t) continue;
        else return { diameter, vector };
    }
    return false;
}

const generateOnEmpty = async (id) => {
    const nast = Rand(3, 12);
    let taken = [];
    for (let n = 0; n < nast; n++) {
        let diameter = Rand(10, 25);
        let v = findSpace(diameter, taken);
        if (v) {
            const vector = v.vector;
            taken.push(v);
            const ast = await asteroid(nameGen("asteroid"),id, vector.x, vector.y, diameter);
        }
    }
}

const generateOnSun = async (id) => {
    const nast = Rand(1, 5);
    let nsun = Rand(1, 3);
    const nplanet = Rand(3, 7);
    if (nsun == 2) nsun = Rand(1, 3);
    let taken = [];
    if (nsun == 1) {
        let sun1 = false;
        while (!sun1) sun1 = await sun(nameGen("sun"), id, 500, 500, Rand(3000, 9000), Rand(100, 250));
        taken.push({ vector: Vector(sun1.pos_x, sun1.pos_y), diameter: sun1.diameter });
    } else if (nsun == 2) {
        let sun1 = false;
        while (!sun1) sun1 = await sun(nameGen("sun"), id , 500, 375, Rand(3000, 9000), Rand(100, 250));
        let sun2 = false;
        while (!sun2) sun2 = await sun(nameGen("sun"), id, 500, 625, Rand(3000, 9000), Rand(100, 250));
        taken.push({ vector: Vector(sun1.pos_x, sun1.pos_y), diameter: sun1.diameter });
        taken.push({ vector: Vector(sun2.pos_x, sun2.pos_y), diameter: sun2.diameter });
    } else if (nsun == 3) {
        let sun1 = false;
        while (!sun1) sun1 = await sun(nameGen("sun"), id , 500, 375, Rand(3000, 9000), Rand(100, 250));
        let sun2 = false;
        while (!sun2) sun2 = await sun(nameGen("sun"), id , 375, 625, Rand(3000, 9000), Rand(100, 250));
        let sun3 = false;
        while (!sun3) sun3 = await sun(nameGen("sun"), id , 625, 625, Rand(3000, 9000), Rand(100, 250));
        taken.push({ vector: Vector(sun1.pos_x, sun1.pos_y), diameter: sun1.diameter });
        taken.push({ vector: Vector(sun2.pos_x, sun2.pos_y), diameter: sun2.diameter });
        taken.push({ vector: Vector(sun3.pos_x, sun3.pos_y), diameter: sun3.diameter });
    }
    for (let n = 0; n < nplanet; n++) {
        let diameter = Rand(25, 125);
        let temperature = Rand(-300, 300);
        let v = findSpace(diameter, taken);
        if (v) {
            const vector = v.vector;
            taken.push(v);
            const p = await planet(nameGen("planet"), id, vector.x, vector.y, temperature, diameter);
        }
    }
    for (let n = 0; n < nast; n++) {
        let diameter = Rand(10, 25);
        let v = findSpace(diameter, taken);
        if (v) {
            const vector = v.vector;
            taken.push(v);
            const ast = await asteroid(nameGen("asteroid"),id, vector.x, vector.y, diameter);
        }
    }
};

const generateOnBlackHole = async (id) => {
    let diameter = Rand(250, 500);
    let bh = false;
    while (!bh) bh = await blackhole(nameGen("blackhole"), id , 500, 500, diameter);
};

const generateSpace = async (x, y) => {
    let total = x * y , progress = 0;
    const st = new Date().getTime();
    const _s = await spaceZone("Solar System", -1 , -1, "sun");
    const _p = await planet("Earth", _s.id, 300, 300, 32, 78);
    for (let _y = 0; _y < y; _y++) {
        for (let _x = 0; _x < x; _x++) {
            createLoadingBar(total , progress++);
            const _spaceZone = await spaceZone(nameGen("space"), _x, _y, type());
            if (_spaceZone) {
                switch (_spaceZone.type) {
                    case "empty":
                        generateOnEmpty(_spaceZone.id);
                        break;
                    case "sun":
                        generateOnSun(_spaceZone.id);
                        break;
                    case "blackhole":
                        generateOnBlackHole(_spaceZone.id);
                        break;
                    default:
                        break;
                }
            } else {
                const _spaceZone = await spaceZone(nameGen("space"), _x, _y, "empty");
            }
        }
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log("Space generated in : " + (new Date().getTime() - st) + " ms");
}

function createLoadingBar(total, current) {
    const width = 40; 
    const percentage = Math.floor((current / total) * 100);
    const progress = Math.floor((width * current) / total);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    const bar = '[' + '='.repeat(progress) + ' '.repeat(width - progress) + ']';
    process.stdout.write(bar + ` ${percentage}%`);
}

module.exports = generateSpace;