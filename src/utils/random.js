
import { Color } from "pixi.js"

export const randomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
}

export const randomInt = (min, max) => {
    return Math.round(randomFloat(min, max));
}

export const randomColor = () => new Color({
    r: randomInt(0, 255),
    g: randomInt(0, 255),
    b: randomInt(0, 255),
});