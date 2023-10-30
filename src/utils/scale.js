
// Tile to Pixels
export const t2x = (tile) => {
    return tile * 10;
}

// Pixel to Tile
export const x2t = (px) => {
    return px / 10;
}

// Angle to Radians
export const a2r = (angle) => {
    return angle * Math.PI / 180;
}

// Radians to angle 
export const r2a = (radians) => {
    return radians * 180 / Math.PI;
}