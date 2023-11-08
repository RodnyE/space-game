
import { Rectangle } from "pixi.js"
import { getSocket } from "engine/socket"
import { t2x, x2t } from "utils/scale"
import { radian2angle } from "utils/conversion"

const PI = Math.PI;


/**
 * Frame loop for a Game instance
 * 
 * @param {GameContext} gx - game context
 */
export default function loop (gx) {
    const {
        loopStep,
        layer1,
        layer2,
        hjumpFilter,
        
        player,
        players,
        camera,
        spaceEntity,
        minimap,
        moveStick,
        aimStick,
    } = gx;
    
    let hjumpEnabled = false;
    
    //
    // Update player !
    //
    let targetRotation;
    if (aimStick.joy.pressed) {
        targetRotation = Math.atan2(aimStick.joy.y, aimStick.joy.x);
    }
    else targetRotation = Math.atan2(moveStick.joy.y, moveStick.joy.x);
    
    let vx = player.speed * moveStick.joy.x;
    let vy = player.speed * moveStick.joy.y;
    
    player.vx += (vx - player.vx) * 0.01;
    player.vy += (vy - player.vy) * 0.01; 
    
    let player_x = player.x + player.vx;
    let player_y = player.y + player.vy;
    
    // 
    // World collision
    //
    if (player_x < player.width) {
        hjumpEnabled = true;
        player_x = player.width;
    }
    else if (player_x > layer1.width - player.width) {
        hjumpEnabled = true;
        player_x = layer1.width - player.width;
    }
    
    if (player_y < player.height) {
        hjumpEnabled = true;
        player_y = player.height;
    }
    else if (player_y > layer1.height - player.height) {
        hjumpEnabled = true;
        player_y = layer1.height - player.height;
    }
    
    player.x = player_x;
    player.y = player_y;
    
    // joystick pressed !
    if (aimStick.joy.pressed || moveStick.joy.pressed) player.rotation += (targetRotation - player.rotation) * 0.09; 
    
    
    //
    // Update all players !
    //
    for (let pj_name in players) {
        if (pj_name === "current") continue; // ignore if is user
       
        let pj = players[pj_name];
        pj.x += (pj.targetX - pj.x) * 0.1;
        pj.y += (pj.targetY - pj.y) * 0.1;
        pj.rotation += (pj.targetRotation - pj.rotation) * 0.1;
        
        minimap.beginFill(0xff0000);
        minimap.drawRect(pj.x * minimap.k, pj.y * minimap.k, 2, 2);
    }
    
    //
    // Update camera !
    //
    camera.x += (player.x - camera.x) * 0.1;
    camera.y += (player.y - camera.y) * 0.1; 
    
    //
    // Hyperjump camera !
    //
    if (hjumpEnabled && !gx.hjumpEnabled) {
        gx.hjumpEnabled = true; 
        hjumpFilter.enabled = true;
        aimStick.renderable = false;
    }
    else if (!hjumpEnabled && gx.hjumpEnabled) {
        gx.hjumpEnabled = false;
        hjumpFilter.enabled = false;
        aimStick.renderable = true;
    }
    
    
    //
    // Emit current player position to server
    //
    if (loopStep % 5 === 0 && getSocket()) {
        let socket = getSocket();
        
        socket.emit("move", {
            x: x2t(player.x).toFixed(2) - 0,
            y: x2t(player.y).toFixed(2) - 0,
            a: radian2angle(player.rotation).toFixed(2) - 0,
        });
    }
    
    // The displacement of the outer space is going to be equal to:
    // + negative
    // + the remaining space on the screen 
    // + multiplied by the ratio of the camera displacement with respect to the map.
    spaceEntity.x = - (spaceEntity.width - camera.width) * camera.x/layer1.width;
    spaceEntity.y = - (spaceEntity.height - camera.height) * camera.y/layer1.height;
    
    //
    // Draw player path in Minimap
    //
    minimap.beginFill(0x00ff00);
    minimap.drawRect(player.x * minimap.k, player.y * minimap.k, 2, 2);
    
}