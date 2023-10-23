
import { groupD8, Text, Rectangle } from "pixi.js"
import Loader from "gl/Loader"
import Camera from "gl/Camera"
import Entity from "gl/Entity"
import Container from "gl/Container"
import createLoader from "engine/loader"

const worldSize = 1500;
const gx = {}; // game context

/**
 * Init context and game scene
 * 
 * @param {PIXI.Rectangle} size - scene dimensions
 * @return {Promise} - resolve when scene is loaded
 */
const initGameScene = (size) => new Promise((resolve) => {
    let scene = new Container();
    let loader = createLoader();
    let resources = loader.resources;
    
    loader.load(() => {
        let layer1 = new Container();
        let camera = new Camera(layer1, { 
            size: new Rectangle(0, 0, size.width, size.height),
            limits: new Rectangle(0, 0, worldSize, worldSize),
        });
        let debugText = new Text("");
        
        let player = new Entity(resources.ship);
        {
            player.width = 90;
            player.height = 90;
            player.speed = 1.5;
            player.vx = 0;
            player.vy = 0; 
            player.anchor.x = 0.5;
            player.anchor.y = 0.5;
        }
        
        let space = new Entity(resources.space);
        {
            space.width = worldSize;
            space.height = worldSize;
        }
       
        layer1.addChild(space);
        layer1.addChild(player);
        scene.addChild(layer1);
        scene.addChild(debugText);
        
        // show in context
        gx.space = space;
        gx.player = player;
        gx.camera = camera;
        gx.debugText = debugText;
        gx.layer1 = layer1;
        gx.joy = {x: 0, y: 0, s: 0};
        gx.scene = scene;
        
        resolve(scene);
    });
    
});


export {
    gx,
    initGameScene,
}