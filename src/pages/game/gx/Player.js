
import Entity from "gl/Entity"

/**
 * Player object
 */
export default class Player extends Entity {
    constructor (texture) {
        super(texture);
        
        this.vx = 0;
        this.vy = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.targetRotation = 0;
        
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        
        this.speed = 15;
        this.rotationSpeed = 1;
        
        this.width = 90;
        this.height = 90;
    }
}