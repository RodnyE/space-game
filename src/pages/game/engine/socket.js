
import io from "socket.io-client";
import { getGameContext } from "engine/gx"
import { t2x, a2r } from "utils/scale"

let socket;

/**
 * Init socket connection to server
 */
export const initSocket = () => {
    // Connect to the Socket.IO server
    socket = io("/", {
        withCredentials: true
    });
    

    // Connect
    socket.on("connect", (data) => {
        console.log("Connected !");
    });
    
    /**
     * Get space data
     * 
     * @callback
     * @param {object} data - data from server 
     * @param {object[]} planets 
     * @param {object[]} suns
     */
    socket.on("space_data", (data) => {
        let gx = getGameContext();
        
        data.planets.forEach((planet) => {
            gx.setPlanet({
                name: planet.name,
                x: t2x(planet.x),
                y: t2x(planet.y),
                radius: t2x(planet.diameter/2),
            })
        });
        
        data.suns.forEach((sun) => {
            gx.setSun({
                name: sun.name,
                x: t2x(sun.x),
                y: t2x(sun.y),
                radius: t2x(sun.diameter/2),
                temperature: sun.temperature,
            })
        });
    });
    
    /**
     * Get current player data
     */
    socket.on("player_data", (data) => {
        let gx = getGameContext();
        
        gx.player.x = t2x(data.pos.x);
        gx.player.y = t2x(data.pos.y);
        gx.player.playerName = data.name;
    });
    
    /**
     * Get all players data 
     */
    socket.on("players_data", (playersData) => {
        let gx = getGameContext();
        
        for (let pj_name in playersData) {
            
            // ignore if is user
            if (pj_name === gx.player.playerName) continue;
            let pj = playersData[pj_name];
            
            gx.setPlayer({
                name: pj_name,
                texture: gx.resources.ship, // temporary texture
                x: t2x(pj.pos.x),
                y: t2x(pj.pos.y),
                rotation: 0,
            });
        }
    });
    
    /**
     * Get other player join
     */
    socket.on("player_join", (data) => {
        let gx = getGameContext();
        
        // player already exist
        if (gx.players[data.name]) return;
         
        gx.setPlayer({
            name: data.name,
            texture: gx.resources.ship,
            x: t2x(data.pos.x),
            y: t2x(data.pos.y),
            rotation: 0,
        });
    });
    
    /**
     * Get player leave
     */
    socket.on("player_leave", (pj_name) => {
        let gx = getGameContext();
        let pj = gx.players[pj_name];
        
        gx.layer1.removeChild(pj);
        pj.destroy();
        delete gx.players[pj_name];
    });
    
    /**
     * Get others players position
     */
    socket.on("pj_changes", (playersData) => {
        let gx = getGameContext(); 
        
        for (let pj_name in playersData) {
            
            // ignore if is user
            if (pj_name === gx.player.playerName) continue;
            
            let data = playersData[pj_name];
            let pj = gx.players[pj_name];
            
            if (data.pos.x) pj.targetX = t2x(data.pos.x);
            if (data.pos.y) pj.targetY = t2x(data.pos.y);
            if (data.a) pj.targetRotation = a2r(data.a);
            
        } 
    });
    
    // Any
    socket.onAny((name, data) => {
        if (name === "pj_changes") return;
        console.log("ws:" + name, data);
    })
}

/**
 * Get socket instance
 * @return {Socket}
 */
export const getSocket = () => {
    return socket;
}