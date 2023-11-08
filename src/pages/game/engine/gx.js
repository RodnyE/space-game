
import { groupD8, Text, Rectangle } from "pixi.js"
import GameContext from "gx/GameContext"

import createLoader from "engine/loader"
import loop from "engine/loop"
import { initSocket, getSocket } from "engine/socket"
import { t2x } from "utils/scale"

let gx;

/**
 * Get current game context 
 * 
 * @return {GameContext} 
 */
export const getGameContext = () => gx;


/**
 * Init context and game scene
 * 
 * @param {PIXI.Rectangle} canvas - game view dimensions
 * @return {Promise} - resolve when scene is loaded
 */
export const initGameContext = (canvas) => new Promise((resolve) => {
    
    let loader = createLoader();
    let resources = loader.resources;
    
    // Resources ready!
    loader.load()
    .then(() => {
        
        // Create game context
        gx = new GameContext({
            resources,
            canvas,
            size: new Rectangle(0,0, t2x(1000), t2x(1000)),
        })
        
        // Play background music
        gx.music = resources.spaceSound;
        //gx.music.play();
        
        // 
        gx.loopStep = 0;
        gx.loop = () => {
            let { moveStick, aimStick } = gx;
            
            loop(gx);
            
            // Update aim joystick
            if (aimStick.joy.s === 1) {
                aimStick.tickerLoop(10);
                if (!resources.shoot_01_snd.playing()) resources.shoot_01_snd.play("shoot");
                
                // Animation every 10 frames
                if (gx.loopStep % 10 === 0) {
                    navigator.vibrate(50);
                    aimStick.externalJoy.scale.set(1.2);
                }
                else {
                    aimStick.externalJoy.scale.set(1);
                }
            }
            else {
                if (resources.shoot_01_snd.playing()) resources.shoot_01_snd.stop()
                aimStick.tickerLoop();
            }
            
            // Update movement joystick
            if (moveStick.joy.s) {
                moveStick.tickerLoop(10);
            }
            else {
                moveStick.tickerLoop();
            }
            
            gx.loopStep ++;
        }
        
        // Connect to server
        initSocket();
        
        // end scene load
        resolve(gx);
    });
    
});