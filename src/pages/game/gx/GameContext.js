
import { 
    Rectangle, 
    Matrix,
    Graphics, 
    Text,
    Color 
} from "pixi.js"
import { ZoomBlurFilter } from "@pixi/filter-zoom-blur"

import Camera from "gl/Camera"
import Container from "gl/Container"
import Entity from "gl/Entity"

import ButtonCtrl from "gx/ButtonCtrl"
import JoystickCtrl from "gx/JoystickCtrl"
import Player from "gx/Player"
import Planet from "gx/Planet"

import { randomInt } from "utils/random"

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
        
        
        // game filters
        let hjumpFilter = new ZoomBlurFilter();
            hjumpFilter.enabled = false;
        this.hjumpFilter = hjumpFilter;
        
        
        // Layouts
        let layer1 = new Container(); // game entities
        let layer2 = new Container(); // background 
        let gameLayer = new Container(); 
        
        layer1.sortableChildren = true; 
        gameLayer.filterArea = new Rectangle(0, 0, canvas.width, canvas.height);
        gameLayer.addChild(layer2);
        gameLayer.addChild(layer1);
        gameLayer.filters = [hjumpFilter];
        scene.addChild(gameLayer);
        
        this.layer1 = layer1; 
        this.layer2 = layer2;
        this.gameLayer = gameLayer;
         
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
            texture: resources.ship_01,
            x: 0,
            y: 0,
            rotation: 0,
        });
        this.player = player;
        
        
        // Movement Joystick
        let moveStick = new JoystickCtrl({
            internalTexture: resources["int-joy"],
            externalTexture: resources["out-joy"],
            size: 250,
        });
        moveStick.x = 50;
        moveStick.y = - 50 + canvas.height - moveStick.height;
        scene.addChild(moveStick);
        
        // Shooting Joystick 
        let aimStick = new JoystickCtrl({
            internalTexture: resources["int-joy"],
            externalTexture: resources["out-joy"],
            size: 200,
        });
        aimStick.x = - 40 + canvas.width - aimStick.width;
        aimStick.y = - 40 + canvas.height - aimStick.height;
        scene.addChild(aimStick); 
        
        // HyperJump Button
        let hjumpButton = new ButtonCtrl(resources["int-joy"]);
        hjumpButton.position = aimStick.position;
        scene.addChild(hjumpButton);
        
        
        // Debug text
        this.debug = new Text("");
        scene.addChild(this.debug);
        
        this.moveStick = moveStick;
        this.aimStick = aimStick;
        this.hjumpButton = hjumpButton;
        
        
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
    setPlanet ({
        name, 
        texture,
        color,
        temperature, 
        radius, x, y
    }) {
        let planet = new Planet({
            name,
            texture,
            color,
            temperature,
            radius,
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
            x * minimap.k, 
            y * minimap.k, 
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
            texture: this.resources.planet_04,
            color,
            temperature,
            radius,
        });
        
        // position
        sun.x = x;
        sun.y = y;
        
        // draw in minimap
        let minimap = this.minimap;
        minimap.beginFill(color);
        minimap.drawCircle(
            x * minimap.k, 
            y * minimap.k, 
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
    setPlayer({name, texture, x, y, rotation}) {
        let player = new Player(texture);
        
        player.playerName = name;
        player.zIndex = 5; 
        
        player.x = x;
        player.y = y;
        player.rotation = rotation;
        
        player.targetX = x;
        player.targetY = y;
        player.targetRotation = rotation;
        
        this.layer1.addChild(player); 
        this.players[name] = player;
        
        return player;
    }
}