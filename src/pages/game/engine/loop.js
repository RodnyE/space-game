
import { gx } from "engine/scene";

const PI = Math.PI;

export default function loop () {
    const {
        player,
        camera,
        joy,
        debugText,
    } = gx;
    
    if (!gx.scene) return;
    
    let joyRotation = Math.atan2(joy.y, joy.x);// + PI;
    
    let vx = player.speed * joy.x;
    let vy = player.speed * joy.y;
    
    player.vx += (vx - player.vx) * 0.01;
    player.vy += (vy - player.vy) * 0.01; 
    
    player.x += player.vx;
    player.y += player.vy;
    camera.x += (player.x - camera.x) * 0.03;
    camera.y += (player.y - camera.y) * 0.03; 
    
    // Zoom ease
    if (vx || vy) {
        camera.z += (0.89 - camera.z) * 0.01;
    }
    else {
        camera.z += (1 - camera.z) * 0.01;
    }
    
    // Player rotation
    if (joy.s) {
        // joystick pressed !
        player.rotation += (joyRotation - player.rotation) * 0.09;
    }
    
    //debugText.text = player.rotation / PI + "π"
}