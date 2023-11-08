
import { Sprite } from "pixi.js"
import Container from "gl/Container"

/**
 * A joystick controller class
 * @class JoystickCtrl
 * @extends Container
 */
export default class JoystickCtrl extends Container {
  
   /**
    * JoystickCtrl constructor.
    * @param {Object} options - The options for the joystick controller.
    * @param {number} options.size - The size of the joystick controller.
    * @param {Texture} options.internalTexture - The texture for the internal joystick.
    * @param {Texture} options.externalTexture - The texture for the external joystick.
    */
   constructor ({
        size,
        internalTexture, 
        externalTexture,
    }) {
        super();
        
        // Create internal and external joystick sprites
        let internalJoy = new Sprite(internalTexture);
        let externalJoy = new Sprite(externalTexture);
        let joy = {
            x: 0,
            y: 0,
            pressed: false,
            s: 0,
        };
        
        let center = size / 2;
        let radius = size / 2;
        let joyRadius = size / 4;
        let joyMax = radius - joyRadius;

        // Set properties for internal joystick sprite
        internalJoy.anchor.set(0.5);
        internalJoy.alpha = 0.2;
        internalJoy.width = joyRadius * 2;
        internalJoy.height = joyRadius * 2;
        
        // Set properties for external joystick sprite
        externalJoy.anchor.set(0.5);
        externalJoy.alpha = 0.2;
        externalJoy.width = size;
        externalJoy.height = size;

        let joyX = center; 
        let joyY = center;
        internalJoy.position.set(joyX, joyY);
        externalJoy.position.set(joyX, joyY);

        /**
         * Event handler for when the pointer is pressed down on the joystick.
         */
        const startHandler = (e) => {
            if (this.pointerId) return;
            
            joy.pressed = true;
            this.pointerId = e.pointerId;
        }

        /**
         * Event handler for when the pointer is moved on the joystick.
         */
        const moveHandler = (e) => {
            if (e.pointerId !== this.pointerId) return;
            if (!joy.pressed) return;
            
            let offset = this.toGlobal({x:0,y:0});
            
            let touchX = e.global.x - offset.x;
            let touchY = e.global.y - offset.y;

            let sideX = touchX - radius;
            let sideY = touchY - radius; 
            let radian = Math.atan2(sideY, sideX);

            if (sideX * sideX + sideY * sideY >= joyMax * joyMax) {
                joyX = joyMax * Math.cos(radian);
                joyY = joyMax * Math.sin(radian);
            } else {
                joyX = Math.abs(sideX) > joyMax ? joyMax : Math.abs(sideX);
                joyY = Math.abs(sideY) > joyMax ? joyMax : Math.abs(sideY);
            }

            if (sideX < 0) joyX = - Math.abs(joyX);
            if (sideY < 0) joyY = - Math.abs(joyY);
            joyX += radius;
            joyY += radius;
            internalJoy.position.set(joyX, joyY); 

            joy.x = (joyX - center) / joyMax;
            joy.y = (joyY - center) / joyMax;
            joy.s = Math.sqrt(joy.x * joy.x + joy.y * joy.y);
            joy.s = joy.s > 0.9999999 ? 1 : joy.s;
            
        }

        /**
         * Event handler for when the pointer is released on the joystick.
         */
        const endHandler = (e) => {
            if (this.pointerId !== e.pointerId) return;
            
            joy.pressed = false;
            joy.x = 0;
            joy.y = 0;
            joy.s = 0;
            joyX = center;
            joyY = center;
            internalJoy.position.set(joyX, joyY);
            this.pointerId = null;
        } 
        
        this.eventMode = "static";
        
        this.on("pointerdown", startHandler);
        this.on("globalpointermove", moveHandler);
        this.on("pointerup", endHandler);
        this.on("pointerupoutside", endHandler);
        
        // Add internal and external joystick sprites to container
        this.addChild(externalJoy);
        this.addChild(internalJoy);
        
        // Set joystick and sprite properties as instance variables
        this.joy = joy;
        this.internalJoy = internalJoy;
        this.externalJoy = externalJoy;
    }
    
    /**
     * A ticker loop function that rotates the joystick sprites.
     */
    tickerLoop (delay = 1) {
        this.internalJoy.rotation += Math.PI / 2000 * delay;
        this.externalJoy.rotation -= Math.PI / 1000 * delay;
    }
}