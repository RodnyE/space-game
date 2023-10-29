
import io from "socket.io-client";
import { getGameContext } from "engine/scene"
import { t2x } from "utils/scale"

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
    
    // get space data
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
    
    // get player data 
    socket.on("player_data", (data) => {
        let gx = getGameContext();
        
        gx.player.x = t2x(data.pos.x);
        gx.player.y = t2x(data.pos.y);
    })
    
    // Any
    socket.onAny((name, data) => {
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