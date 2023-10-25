
import { groupD8, Text, Rectangle } from "pixi.js"
import GameContext from "../game/GameContext"

import createLoader from "engine/loader"
import loop from "engine/loop"

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
    loader.load().then((resources) => {
        
        // Create game context
        gx = new GameContext({
            resources,
            canvas,
            size: new Rectangle(0,0, 900, 900),
        })
        
        // Play background music
        resources.spaceSound.play();
        
        // 
        gx.loop = () => loop(gx);
        gx.joy = {x:0, y:0, s:0};
        
        // end scene load
        resolve(gx);
    });
    
});