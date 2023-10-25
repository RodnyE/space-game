
import Camera from "gl/Camera"
import Container from "gl/Container"

import { Rectangle } from "pixi.js"
import Entity from "gl/Entity"
import Player from "./Player"

/**
 * Game 
 * 
 * @param {object} resources - textures loaded
 * @param {PIXI.Rectangle} canvas - game view dimensions
 * @param {PIXI.Rectangle} size - world dimensions
 */
export default class GameContext {
    constructor ({
        resources,
        canvas,
        size,
    }) {
        // play background music
        //let music = resources.spaceSound.play();
        
        // create game interface
        let scene = new Container();
        let layer1 = new Container();
        let camera = new Camera(layer1, { 
            size: new Rectangle(0, 0, canvas.width, canvas.height),
            limits: new Rectangle(0, 0, size.width, size.height),
        });
        
        // background environment 
        let space = new Entity(resources.space);
        {
            space.width = size.width;
            space.height = size.height;
            layer1.addChild(space);
        }
        
        // Player
        let player = new Player(resources.ship);
        layer1.addChild(player); 
       
        scene.addChild(layer1);
        
        // context
        this.player = player;
        this.scene = scene;
        this.layer1 = layer1;
        this.camera = camera;
    }
}