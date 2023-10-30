
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
        gx.music.play();
        
        // 
        gx.loop = () => loop(gx);
        gx.joy = {x:0, y:0, s:0};
        
        // Connect to server
        initSocket();
        
        // end scene load
        resolve(gx);
    });
    
});