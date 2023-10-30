
import { getSocket } from "../socket/socket"
import { t2x, x2t } from "utils/scale"

const PI = Math.PI;
let loopStep = 0;


/**
 * Frame loop for a Game instance
 * 
 * @param {GameContext} gx - game context
 */
function loop (gx) {
    const {
        layer1,
        player,
        players,
        camera,
        spaceEntity,
        joy,
        minimap,
    } = gx;
    
    let joyRotation = Math.atan2(joy.y, joy.x);// + PI;
    
    let vx = player.speed * joy.x;
    let vy = player.speed * joy.y;
    
    player.vx += (vx - player.vx) * 0.01;
    player.vy += (vy - player.vy) * 0.01; 
    
    for (let pj_name in players) {
        let pj = players[pj_name];
        pj.x += pj.vx;
        pj.y += pj.vy; 
    }
    
    camera.x += (player.x - camera.x) * 0.1;
    camera.y += (player.y - camera.y) * 0.1; 
    
    if (loopStep % 5 === 0 && getSocket()) {
        let socket = getSocket();
        
        socket.emit("move", {
            x: x2t(player.x).toFixed(2),
            y: x2t(player.y).toFixed(2),
        });
    }
    
    // The displacement of the outer space is going to be equal to:
    // + negative
    // + the remaining space on the screen 
    // + multiplied by the ratio of the camera displacement with respect to the map.
    spaceEntity.x = - (spaceEntity.width - camera.width) * camera.x/layer1.width;
    spaceEntity.y = - (spaceEntity.height - camera.height) * camera.y/layer1.height;
    
    // Draw player path in Minimap
    minimap.beginFill(0xff0000);
    minimap.drawRect(player.x * minimap.k, player.y * minimap.k, 2, 2);
    
    // Player rotation
    if (joy.s) {
        // joystick pressed !
        player.rotation += (joyRotation - player.rotation) * 0.09;
    }
    
    //debugText.text = player.rotation / PI + "π"
    loopStep ++;
}

export default loop;