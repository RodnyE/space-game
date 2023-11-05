
import {Sprite} from "pixi.js"
import Container from "gl/Container"

export default class JoystickCtrl extends Container {
    constructor ({
        size,
        internalTexture, 
        externalTexture,
    }) {
        super();
        
        let internalJoy = new Sprite(internalTexture);
        let externalJoy = new Sprite(externalTexture);
        let joy = {
            // Relative percentage position (-1 to 1)
            x: 0,
            y: 0,
            pressed: false,
            s: 0, // Center distance to position
        };
        
        let center = size / 2;
        let radius = size / 2;
        let joyRadius = size / 4;
        let joyMax = radius - joyRadius; // Maximum distance joystick can move from center

        internalJoy.anchor.set(0.5);
        internalJoy.alpha = 0.2;
        internalJoy.width = joyRadius * 2;
        internalJoy.height = joyRadius * 2;
        
        externalJoy.anchor.set(0.5);
        externalJoy.alpha = 0.2;
        externalJoy.width = size;
        externalJoy.height = size;

        // Relative position
        let joyX = center; 
        let joyY = center;
        internalJoy.position.set(joyX, joyY);
        externalJoy.position.set(joyX, joyY);

        /**
         * Event handler for when the user starts interacting with the joystick.
         */
        const startHandler = () => {
            joy.pressed = true;
        }

        /**
         * Event handler for when the user is moving the joystick.
         */
        const moveHandler = (e) => {
            if (!joy.pressed) return;
            
            let offset = this.toGlobal({x:0,y:0});
            
            // Relative touch position
            let touchX = e.global.x - offset.x;
            let touchY = e.global.y - offset.y;

            // Distance from touch position to center
            let sideX = touchX - radius;
            let sideY = touchY - radius; 
            let radian = Math.atan2(sideY, sideX); // Angle relative to the center

            // Check if joystick is colliding with the border of the canvas
            if (sideX * sideX + sideY * sideY >= joyMax * joyMax) {
                joyX = joyMax * Math.cos(radian);
                joyY = joyMax * Math.sin(radian);
            } else {
                joyX = Math.abs(sideX) > joyMax ? joyMax : Math.abs(sideX);
                joyY = Math.abs(sideY) > joyMax ? joyMax : Math.abs(sideY);
            }

            // Update joystick position based on touch position
            if (sideX < 0) joyX = - Math.abs(joyX);
            if (sideY < 0) joyY = - Math.abs(joyY);
            joyX += radius;
            joyY += radius;
            internalJoy.position.set(joyX, joyY); 

            // Calculate relative x, y positions and strench value
            joy.x = (joyX - center) / joyMax;
            joy.y = (joyY - center) / joyMax;
            joy.s = Math.sqrt(joy.x * joy.x + joy.y * joy.y);
            joy.s = joy.s > 0.9999999 ? 1 : joy.s;
            
        }

        /**
         * Event handler for when the user stops interacting with the joystick.
         */
        function endHandler() {
            joy.pressed = false;
            joy.x = 0;
            joy.y = 0;
            joy.s = 0;
            joyX = center;
            joyY = center;
            internalJoy.position.set(joyX, joyY);
        }
        
        /**
         * 
         */
        this.eventMode = "static"; // Enable events on this container
        this.on("pointerdown", startHandler);
        this.on("globalpointermove", moveHandler);
        this.on("pointerup", endHandler);
        this.on("pointerupoutside", endHandler);
        
        this.addChild(externalJoy);
        this.addChild(internalJoy);
        this.joy = joy;
        this.internalJoy = internalJoy;
        this.externalJoy = externalJoy;
    }
    
    
    tickerLoop () {
        this.internalJoy.rotation += Math.PI / 2000;
        this.externalJoy.rotation -= Math.PI / 1000;
    }
}