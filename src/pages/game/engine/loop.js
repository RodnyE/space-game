
import { getSocket } from "engine/socket"
import { t2x, x2t } from "utils/scale"
import { radian2angle } from "utils/conversion"

const PI = Math.PI;
let loopStep = 0;


/**
 * Frame loop for a Game instance
 * 
 * @param {GameContext} gx - game context
 */
export default function loop (gx) {
    const {
        layer1,
        player,
        players,
        camera,
        spaceEntity,
        joy,
        minimap,
    } = gx;
    
    //
    // Update player !
    //
    let targetRotation = Math.atan2(joy.y, joy.x);// + PI;
    
    let vx = player.speed * joy.x;
    let vy = player.speed * joy.y;
    
    player.vx += (vx - player.vx) * 0.01;
    player.vy += (vy - player.vy) * 0.01; 
    player.x += player.vx;
    player.y += player.vy;
    
    // joystick pressed !
    if (joy.s) player.rotation += (targetRotation - player.rotation) * 0.09; 
    
    //
    // Update all players !
    //
    for (let pj_name in players) {
        if (pj_name === "current") continue; // ignore if is user
       
        let pj = players[pj_name];
        pj.x += (pj.targetX - pj.x) * 0.03;
        pj.y += (pj.targetY - pj.y) * 0.03;
        pj.rotation += (pj.targetRotation - pj.rotation) * 0.09;
        
        minimap.beginFill(0xff0000);
        minimap.drawRect(pj.x * minimap.k, pj.y * minimap.k, 2, 2);
    }
    
    //
    // Update camera !
    //
    camera.x += (player.x - camera.x) * 0.1;
    camera.y += (player.y - camera.y) * 0.1; 
    
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
    
    //debugText.text = player.rotation / PI + "π"
    loopStep ++;
}