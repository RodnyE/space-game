const fs = require("fs");
const db = require("../config.js").DB;

if(fs.existsSync(db + "/db.sqlite")) {
    fs.unlinkSync(db + "/db.sqlite");
    console.log("Database remove successfully");
}else console.log("Database not found...");