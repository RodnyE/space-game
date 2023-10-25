
import { groupD8 } from "pixi.js"
import Loader from "gl/Loader"

// images
import shipImg from "assets/ship.png"
import earthImg from "assets/earth.png"
import spaceImg from "assets/outer-space.png"

// sound
import spaceSnd from "assets/outer_space_01.aac"

/**
 * Setup game textures 
 * @returns {Loader} 
 */
export default function createLoader () {
    let loader = new Loader();
    
    loader.add({
        name: "space", 
        src: spaceImg,
    }) 
    loader.add({
        name: "earth", 
        src: earthImg,
    }) 
    loader.add({
        name: "ship", 
        src: shipImg, 
        preprocess (tx) {
            tx.rotate = groupD8.N; 
        }
    })
    loader.addSound({
        name: "spaceSound",
        cfg: {
            src: [spaceSnd],
            loop: true,
            volume: 2,
        }
    });
    
    return loader;
}