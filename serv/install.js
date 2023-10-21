const fs = require("fs");

let x = process.argv[2];
let y = process.argv[3];
function isN(value) {
    value = value - 0;
    return Number.isInteger(value) && value >= 1;
}

if ((!x || !y) || isN(x) == false || isN(y) == false) {
    console.log("Usage 'npm run inst (x_distance(int)) (y_distance(int))'")
}
else {
    if(fs.existsSync(require("../config.js").DB + "/db.sqlite")) return console.log("Database already exists. Please use 'npm run uninst' to delete database.");
    require("./engine/generation/generateSpace.js")(x, y);
}