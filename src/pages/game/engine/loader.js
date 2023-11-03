
import { groupD8 } from "pixi.js"
import Loader from "gl/Loader"

import shipImg from "assets/ships/ship_02.png"
import spaceImg from "assets/background/outer-space.png"
import spaceSnd from "assets/music/outer_space_01.aac"

/**
 * Create a imported images object
 */
const importAll = (r) => {
    let cache = {};
    r.keys().forEach((key) => (cache[key] = r(key)));
    return cache;
}

const shipImgs = importAll(require.context("assets/ships", true, /\.png$/));
const planetImgs = importAll(require.context("assets/planets", true, /\.png$/));



// sound

/**
 * Setup game textures 
 * @returns {Loader} 
 */
export default function createLoader () {
    let loader = new Loader();
    
    /**
     * Add a imported images object to loader
     */
    const addImgMap = (imgs, preprocess) => {
        for (let imgUrl in imgs) {
            loader.add({
                name: imgUrl.replace("./", "").replace(".png", ""),
                src: imgs[imgUrl],
                preprocess
            });
        }
    };
    
    addImgMap(planetImgs);
    addImgMap(shipImgs, (texture) => {
        texture.rotate = groupD8.N;
    });
    
    loader.add({
        name: "space", 
        src: spaceImg,
    });
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