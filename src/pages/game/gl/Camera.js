
/**
 * Camera 
 */
class Camera {
    
    /**
     * @param {PIXI.Container} layer - container to move
     * @param {object} cfg - camera configuration
     * @param {PIXI.Rectangle} cfg.size - camera dimensions
     * @param {PIXI.Rectangle} cfg.limits - camera movement limits
     */
    constructor (layer, cfg) {
        // camera size
        this.width = cfg.size.width;
        this.height = cfg.size.height;
        this.limits = cfg.limits;
        
        // layer to move 
        layer.pivot.x = this.width / 2;
        layer.pivot.y = this.height / 2;
        this.layer = layer;
        
        // position
        this._x = 0;
        this._y = 0; 
        this._z = 1; // zoom
    }
    
    get x () {return this._x}
    get y () {return this._y}
    get z () {return this._z}
    
    set x (x) {
        let z = this._z;
        let w = this.width;
        
        let limit = this.limits.width;
        let leftLimit = w/2 + (limit - limit * z)/2;
        let rightLimit = (limit * z) - w/2;
        
        if (x < leftLimit) x = leftLimit;
        else if (x > rightLimit) x = rightLimit;
        
        // update 
        this._x = x;
        this.layer.x = - x + w; 
    }
    
    set y (y) {
        let z = this._z;
        let h = this.height;
        
        let limit = this.limits.height;
        let upLimit = h/2 + (limit - limit*z)/2;
        let downLimit = (limit * z) - h/2;
        
        if (y < upLimit) y = upLimit;
        else if (y > downLimit) y = downLimit;
        
        // update 
        this._y = y;
        this.layer.y = - y + h; 
    }
    
    set z (z) {
      // @TODO fix z scale
      // this.layer.scale.x = z;
      // this.layer.scale.y = z;
      // this._z = z;
    }
}

export default Camera;