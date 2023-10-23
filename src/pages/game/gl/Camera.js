
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
        this.layer = layer;
        
        // position
        this._x = 0;
        this._y = 0; 
    }
    
    get x () {return this._x}
    get y () {return this._y}
    
    set x (x) {
        let middleX = this.width / 2;
        let lx = middleX - x; // layer position
        
        // layer limits
        if (x < middleX) lx = 0;
        else if (x > this.limits.width - middleX) lx = this.width - this.limits.width;
        
        // update 
        this._x = x;
        this.layer.x = lx; 
    }
    
    set y (y) {
        let middleY = this.height / 2;
        let ly = middleY - y; // layer position
        
        // layer limits
        if (y < middleY) ly = 0;
        else if (y > this.limits.height - middleY) ly = this.height - this.limits.height;
        
        // update 
        this._y = y;
        this.layer.y = ly; 
    }
    
}

export default Camera;