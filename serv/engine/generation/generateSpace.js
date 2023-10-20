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

const generateOnEmpty = async (x, y) => {
    const nast = Rand(3, 9);
    let taken = [];
    for(let n = 0; n < nast; n++){
        let diameter = Rand(10 , 25);
        let v = findSpace(diameter , taken);
        if(v){
            const vector = v.vector;
            taken.push(v);
            const ast = await asteroid(nameGen("asteroid") , x , y , vector.x , vector.y , diameter);
        }
    }
}

const generateOnSun = async (x, y) => {
    const nast = Rand(1, 3);
    const nsun = Rand(1, 3);
    const nplanet = Rand(3 , 7);
    let taken = [];
    for(let n = 0; n < nplanet; n++){
        let diameter = Rand(25 , 125);
        let temperature = Rand(-300 , 300);
        let v = findSpace(diameter , taken);
        if(v){
            const vector = v.vector;
            taken.push(v);
            const planet = await planet(nameGen("planet") , x , y , vector.x , vector.y , diameter);
        }
    }
    for(let n = 0; n < nast; n++){
        let diameter = Rand(10 , 25);
        let v = findSpace(diameter , taken);
        if(v){
            const vector = v.vector;
            taken.push(v);
            const ast = await asteroid(nameGen("asteroid") , x , y , vector.x , vector.y , diameter);
        }
    }
}

const generateSpace = async (x, y) => {
    const st = new Date().getTime();
    for (let _y = 0; _y < y; _y++) {
        for (let _x = 0; _x < x; _x++) {
            try {
                const _spaceZone = await spaceZone(nameGen("space"), _x, _y, type());
                if (_spaceZone) {
                    switch (_spaceZone.type) {
                        case "empty":
                            generateOnEmpty(_x, _y);
                            break;
                        case "sun":
                            generateOnSun(_x , _y);
                            break;
                        case "blackhole":

                            break;
                        default:
                            break;
                    }
                } else {
                    const _spaceZone = await spaceZone(nameGen("space"), _x, _y, "empty");
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    console.log("Space generated in : " + (new Date().getTime() - st) + " ms");
}

module.exports = generateSpace;