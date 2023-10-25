
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
        let layer2 = new Container();
        
        layer1.sortableChildren = true;
        scene.addChild(layer2);
        scene.addChild(layer1);
        this.layer1 = layer1;
        this.layer2 = layer2;
        
        // 
        let camera = new Camera(layer1, { 
            size: new Rectangle(0, 0, canvas.width, canvas.height),
            limits: new Rectangle(0, 0, size.width, size.height),
        });
        this.camera = camera;
        
        // background environment 
        let space = new Entity(resources.space);
            space.width = canvas.width * 2;
            space.height = canvas.height * 2;
            layer2.addChild(space); 
        this.spaceEntity = space; 
        
        // Minimap
        let map = new Graphics();
        let mapWidth = 200;
            map.mapWidth = mapWidth;
            map.k = mapWidth / size.width;
            map.x = canvas.width - mapWidth;
            map.y = 0;
            map.beginFill(0xaaaaaa);
            map.drawRect(0, 0, mapWidth, mapWidth * size.height / size.width);
            scene.addChild(map);
        this.minimap = map;
        
        // Player
        let player = new Player(resources.ship);
        player.zIndex = 5;
        layer1.addChild(player); 
        this.player = player;
       
        
        // context
        this.resources = resources;
        this.planets = {};
        
        window.gx = this;
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
        
        // draw in minimap
        let minimap = this.minimap;
        minimap.beginFill(0x0000ff);
        minimap.drawCircle(x * minimap.k, y * minimap.k, radio * minimap.k)
        
        return planet;
    }
}