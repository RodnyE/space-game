
import { Graphics } from "pixi.js"
import Entity from "gl/Entity"

export default class Planet extends Entity {
    constructor ({
        name,
        radio,
        color,
        texture,
    }) {
        super(texture);
        
        this.width = radio * 2;
        this.height = radio * 2;
        
        /**
        this.beginTextureFill({
            color,
            texture,
        });
        this.drawCircle(0, 0, radio);
        this.endFill();
        */
        
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }
}