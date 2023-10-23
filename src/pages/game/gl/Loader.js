
import { Texture } from "pixi.js"
import AudioSprite from "gl/AudioSprite"

/**
 * Loader and resources preprocessor 
 */
class Loader {
    constructor () {
        this.assets = [];
        this.resources = {};
    }
    
    /**
     * Add a texture assets
     * 
     * @param {string} name - asset id
     * @param {string} src - asset url
     * @param {function} preprocess - texture ready
     * @return {Loader}
     */
    add ({name, src, preprocess}) {
        this.assets.push({
            name, 
            src, 
            type: "texture",
            preprocess,
        });
        return this;
    }
    
    /**
     * Add a sound assets
     * 
     * @param {string} name - asset id
     * @param {SoundSprite.params} cfg - configuration 
     * @param {function} preprocess - sound ready
     * @return {Loader} 
     */
    addSound ({name, cfg, preprocess}) {
        this.assets.push({
            name, 
            cfg, 
            type: "sound",
            preprocess,
        });
        return this;
    }
    
    /**
     * Start load all assets
     * 
     * @param {function} callback - assets ready
     */
    load (callback) {
        const assets = this.assets;
        const resources = this.resources;
        
        let promise = Promise.resolve();
        while (assets.length) {
            let {name, src, cfg, preprocess, type} = assets.shift();
            
            promise = promise.then(() => new Promise((resolve)=>{
                
                // texture asset
                if (type === "texture") { 
                    let texture = Texture.from(src);
                    texture.baseTexture.on("loaded", () => {
                        texture.baseTexture.removeListener("loaded");
                        if (preprocess) preprocess(texture);
                        resources[name] = texture;
                        resolve();
                    });
                } 
               
                // sound asset
                else if (type === "sound") {
                    let sound = new AudioSprite(cfg);
                    sound.once("load", () => {
                        if (preprocess) preprocess(sound);
                        resources[name] = sound;
                        resolve();
                    });
                }
            }));
            
        }
        
        promise.then(() => callback());
        return this;
    }
}

export default Loader;