const fs = require('fs');
const config = require("../../../config.js");
const path = require('path');

// Path to the folder containing the JSON files for buildings
const buildingsFolderPath = path.join(config.DB, '/buildings');

const loadBuildings = () => {


    // Object to store buildings with file names (without .json extension) as keys
    const buildings = {};

    // Read the JSON files in the folder
    fs.readdirSync(buildingsFolderPath).forEach((filename) => {
        if (filename.endsWith('.json')) {
            // Extract the building's ID from the file name (excluding the .json extension)
            const buildingId = filename.replace('.json', '');

            // Read the content of the JSON file
            const filePath = path.join(buildingsFolderPath, filename);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            try {
                // Parse the file content into a JavaScript object
                const building = JSON.parse(fileContent);

                // Add the object to the "buildings" object using the file name (without .json) as the key
                buildings[buildingId] = building;
            } catch (error) {
                console.error(`Error reading the file ${filename}: ${error.message}`);
            }
        }
    });
    console.log("Buildings loaded.");
    return buildings;
};

module.exports = loadBuildings;