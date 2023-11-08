const fs = require('fs');
const config = require("../../../config.js");
const path = require('path');

// Path to the folder containing the JSON files
const itemsFolderPath = path.join(config.DB, '/items');

const loadItems = () => {
    // Object to store items with their IDs as keys
    const items = {};

    // Read the JSON files in the folder
    fs.readdirSync(itemsFolderPath).forEach((filename) => {
        if (filename.endsWith('.json')) {
            // Read the content of the JSON file
            const filePath = path.join(itemsFolderPath, filename);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            try {
                // Parse the file content into a JavaScript object
                const item = JSON.parse(fileContent);

                // Add the object to the "items" object using the ID as the key
                if (item.id) {
                    items[item.id] = item;
                } else {
                    console.log(`The file ${filename} does not contain an ID.`);
                }
            } catch (error) {
                console.error(`Error reading the file ${filename}: ${error.message}`);
            }
        }
    });
    console.log("Items loaded.");
    return items;
};

module.exports = loadItems;