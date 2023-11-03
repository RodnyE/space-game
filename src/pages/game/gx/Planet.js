
import Entity from "gl/Entity"
import { randomFloat } from "utils/random"

/**
 * Planet Entity 
 * @class
 */
export default class Planet extends Entity {
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
        texture,
        color,
        temperature,
        radius,
    }) {
        super(texture);
        
        this.tint = color;
        this.width = radius * 2;
        this.height = radius * 2;
        this.rotation = randomFloat(0, Math.PI * 2);
        
        // Anchor
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.zIndex = 2;
        
        // context
        this.planetName = name;
        this.planetTemperature = temperature;
        
    }
}