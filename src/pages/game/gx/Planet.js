
import { Graphics } from "pixi.js"
import { randomColor } from "utils/random"

/**
 * Planet Entity 
 * @class
 */
export default class Planet extends Graphics {
    /**
     * @property {string} planetName
     * @property {number} planetTemperature 
     */
    
    /**
     * @constructor
     * @param {string} name + planet name
     * @param {number} temperature + planet temperature (Earth temperature=32)
     * @param {number} radius + planet radius 
     * @param {PIXI.ColorSource} color + ocean color
     */
    constructor ({
        name,
        temperature,
        radius,
        color,
    }) {
        super();
       
        // Draw planet
        this.beginFill(color || 0x0000ff);
        this.drawCircle(0, 0, radius);
        this.endFill();

        // Generate random continents
        let continentColor = randomColor();
        let continentsLength = Math.random() * 5 + 1;  // Entre 1 y 6 continentes
        for (let i = 0; i < continentsLength; i++) {
            let continentRadius = Math.random() * (radius * 0.4) + radius * 0.2;  // 20% and 80% of planet radius
            let continentX = 2 * Math.random() * (radius - continentRadius) - (radius - continentRadius);  
            let continentY = 2 * Math.random() * (radius - continentRadius) - (radius - continentRadius);  
    
            // Draw continent
            this.beginFill(continentColor);
            this.drawCircle(continentX, continentY, continentRadius);
        } 
        
        // Anchor
        this.pivot.x = this.width / 2;
        this.pivot.y = this.height / 2;
        this.zIndex = 2;
        
        // context
        this.planetName = name;
        this.planetTemperature = temperature;
    }
}