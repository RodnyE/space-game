
import { groupD8 } from "pixi.js"
import Loader from "gl/Loader"

// images
import shipImg from "assets/ship.png"
import spaceImg from "assets/outer-space.png"

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
        name: "ship", 
        src: shipImg, 
        preprocess (tx) {
            tx.rotate = groupD8.N; 
        }
    });
    
    return loader;
}