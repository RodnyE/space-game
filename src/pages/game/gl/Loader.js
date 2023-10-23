
import { Texture } from "pixi.js"

class Loader {
    constructor () {
        this.assets = [];
        this.resources = {};
    }
    
    add ([name, src, preprocess]) {
        this.assets.push([name, src, preprocess]);
        return this;
    }
    
    load (callback) {
        const assets = this.assets;
        const resources = this.resources;
        
        let promise = Promise.resolve();
        while (assets.length) {
            let [name, src, preprocess] = assets.shift();
            
            promise = promise.then(() => new Promise((resolve)=>{
                let texture = Texture.from(src);
                texture.baseTexture.on("loaded", () => {
                    texture.baseTexture.removeListener("loaded");
                    if (preprocess) preprocess(texture);
                    resources[name] = texture;
                    resolve();
                });
            }));
        }
        
        promise.then(()=>callback());
        return this;
    }
}

export default Loader;