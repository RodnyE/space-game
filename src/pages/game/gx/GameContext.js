
import { 
    Rectangle, 
    Matrix,
    Graphics, 
    Color 
} from "pixi.js"

import Camera from "gl/Camera"
import Container from "gl/Container"
import Entity from "gl/Entity"

import Player from "gx/Player"
import Planet from "gx/Planet"

import { randomColor } from "utils/random"

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
        // context
        this.resources = resources;
        this.players = {};
        this.planets = {};
        this.suns = {};
        
        window.gx = this;
        
        
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
            map.k = mapWidth / size.width; // proportion factor
            map.mapWidth = mapWidth;
            map.x = canvas.width - mapWidth;
            map.y = 0;
            map.beginTextureFill({
                texture: resources.space,
                matrix: new Matrix(
                    mapWidth / resources.space.width,  0, 0, 
                    mapWidth / resources.space.height, 0, 0,
                ),
            });
            map.drawRect(0, 0, mapWidth, mapWidth * size.height / size.width);
            scene.addChild(map);
        this.minimap = map;
        
        // Player
        let player = this.setPlayer({
            name: "current",
            texture: resources.ship,
            x: 0,
            y: 0,
        });
        this.player = player;
        
        
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
    setPlanet ({name, temperature, radius, x, y}) {
        let color = randomColor();
        let planet = new Planet({
            name,
            radius,
            temperature,
            color,
        });
        
        if (x || y) {
            planet.x = x;
            planet.y = y;
        }
        
        this.planets[name] = planet;
        this.layer1.addChild(planet);
        this.layer1.sortChildren();
        
        // draw in minimap
        let minimap = this.minimap;
        minimap.beginFill(0x000088);
        minimap.drawCircle(
            (x - radius) * minimap.k, 
            (y - radius) * minimap.k, 
            radius * minimap.k
        );
        
        return planet;
    }
    
    /**
     * Add sun
     */
    setSun({name, temperature, radius, x, y}) {
        let color = new Color("yellow");
        let sun = new Planet({
            name,
            radius,
            temperature,
            color,
        });
        sun.beginFill(color);
        sun.drawCircle(0, 0, radius);
        
        // position
        sun.x = x;
        sun.y = y;
        
        // draw in minimap
        let minimap = this.minimap;
        minimap.beginFill(color);
        minimap.drawCircle(
            (x - radius) * minimap.k, 
            (y - radius) * minimap.k, 
            radius * minimap.k
        );
        
        this.suns[name] = sun;
        this.layer1.addChild(sun);
        this.layer1.sortChildren();
        
        return sun;
    }
    
    /** 
     * Set player
     */
    setPlayer({name, texture, x, y}) {
        let player = new Player(texture);
        
        player.playerName = name;
        player.zIndex = 5; 
        player.x = x;
        player.y = y;
        this.layer1.addChild(player); 
        this.players[name] = player;
        
        return player;
    }
}