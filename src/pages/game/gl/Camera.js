
class Camera {
    constructor (layer, renderer) {
        this.layer = layer;
        this.renderer = renderer;
        this._x = 0;
        this._y = 0;
    }
    
    get x () {return this._x}
    get y () {return this._y}
    
    set x (x) {
        let middleX = this.renderer.width / 2;
        this._x = x;
        this.layer.x = middleX - x;
    }
    
    set y (y) {
        let middleY = this.renderer.height / 2;
        this._y = y;
        this.layer.y = middleY - y;
    }
    
}

export default Camera;