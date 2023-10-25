
import Camera from "gl/Camera"
import Container from "gl/Container"

import { Rectangle, Graphics } from "pixi.js"
import Entity from "gl/Entity"
import Player from "./Player"
import Planet from "./Planet"

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
        
        // create game interface
        let scene = new Container();
        this.scene = scene;
        
        // game container
        let layer1 = new Container();
            layer1.sortableChildren = true;
            scene.addChild(layer1);
        this.layer1 = layer1;
        
        // 
        let camera = new Camera(layer1, { 
            size: new Rectangle(0, 0, canvas.width, canvas.height),
            limits: new Rectangle(0, 0, size.width, size.height),
        });
        this.camera = camera;
        
        // background environment 
        let space = new Entity(resources.space);
            space.width = size.width;
            space.height = size.height;
            layer1.addChild(space); 
        this.spaceEntity = space;
        
        // player
        let player = new Player(resources.ship);
        player.zIndex = 5;
        layer1.addChild(player); 
        this.player = player;
        
        // context
        this.resources = resources;
        this.planets = {};
        
    }
    
    /**
     * Set world size
     */
    setSize (width, height) {
        this.camera.limits = {width, height};
        
        this.spaceEntity.width = width;
        this.spaceEntity.height = height;
    }
    
    /**
     * Add planets
     */
    setPlanet ({name, radio, x, y}) {
        let planet = new Planet({
            name,
            radio,
            color: 0x0000ff,
            texture: this.resources.earth
        });
        
        planet.zIndex = 2;
        if (x || y) {
            planet.x = x;
            planet.y = y;
        }
        
        this.planets[name] = planet;
        this.layer1.addChild(planet);
        this.layer1.sortChildren();
        
        return planet;
    }
}