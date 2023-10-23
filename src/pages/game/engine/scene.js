
import { groupD8, Text } from "pixi.js"
import Loader from "gl/Loader"
import Camera from "gl/Camera"
import Entity from "gl/Entity"
import Container from "gl/Container"

import shipImg from "assets/ship.png"
import spaceImg from "assets/outer-space.png"

const worldSize = 1500;
const gx = {}; // game context


const createScene = () => {
    let scene = new Container();
    let loader = new Loader();
    let resources = loader.resources; 
    
    loader
        .add(["ship", shipImg, (tx) => {
           tx.rotate = groupD8.N; 
        }]) 
        .add(["space", spaceImg]) 
    
    loader.load(() => {
        let layer1 = new Container();
        let camera = new Camera(layer1, gx.renderer);
        let debugText = new Text("");
        
        let player = new Entity(resources.ship);
        let space = new Entity(resources.space);
        {
            player.width = 90;
            player.height = 90;
            player.speed = 1.5;
            player.speedRotation = 1;
            player.vx = 0;
            player.vy = 0; 
            player.anchor.x = 0.5;
            player.anchor.y = 0.5;
        }
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
        gx.scene = scene;
    })
    return scene;
}


export {
    gx,
    createScene,
}