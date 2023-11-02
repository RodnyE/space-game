
import { Color } from "pixi.js"

// Angle to Radians
export const angle2radian = (angle) => {
    return angle * Math.PI / 180;
}

// Radians to angle 
export const radian2angle = (radians) => {
    return radians * 180 / Math.PI;
}

// Planet temperature to rgb color
export const temperature2color = (temperature) => {
    let n = Math.min(300, Math.max(-300, temperature));

    // R, G y B
    const r = Math.floor((300 + n) * 255 / 600);  // red
    const g = Math.floor(Math.min(255, Math.max(-255, (Math.abs(255 - n)) * 255) / 300));  // green
    const b = Math.abs(Math.floor((n - 300) * 255 / 600));  // blue
 
    return new Color({r, g, b});
}