
import { Graphics, Matrix } from "pixi.js";
  
/**
 * Fast render tiling images
 */
export default class TilingEntity extends Graphics {
    constructor (texture, width, height) {
        super();
        
        this.tileTexture = texture;
        this.tileMatrix = new Matrix(1, 0, 0, 1, 0, 0);
        this._tileX = 0;
        this._tileY = 0; 
        
        this.beginFill(0xff0000);
        this.drawRect(0, 0, width, height);
        this.draw();
    }
    
    draw () {
        this.beginTextureFill({
            texture: this.tileTexture,
            matrix: this.tileMatrix,
        });
        
        for (let drawY = this.tileY; drawY < this.height; drawY += this.tileHeight) {
            for (let drawX = this.tileX; drawX < this.width; drawX += this.tileWidth) {
                this.drawRect(
                    drawX,
                    drawY,
                    this.tileWidth,
                    this.tileHeight,
                );
            }
        }
        
        this.endFill();
        
    }
    
    /**
     * Set tile position 
     */
    get tileX () {return this._tileX}
    get tileY () {return this._tileY}
    
    set tileX (x) {
        let tileWidth = this.tileWidth; 
        let tilesInt = tileWidth * Math.ceil(this.width / tileWidth); 
        
        this._tileX = x - (tilesInt * Math.floor(x / tilesInt));
        this.draw();
    }
    set tileY (y) {
        let tileHeight = this.tileHeight; 
        let tilesInt = tileHeight * Math.ceil(this.height / tileHeight); 
        
        this._tileY = y - (tilesInt * Math.floor(y / tilesInt)); 
        this.draw();
    }
    
    /**
     * Set tile dimensions
     */
    get tileWidth () {return this.tileTexture.width * this.tileMatrix.a}
    get tileHeight () {return this.tileTexture.height * this.tileMatrix.d}
    
    set tileWidth (w) {
        this.tileMatrix.a = w / this.tileTexture.width; 
    }
    set tileHeight (h) {
        this.tileMatrix.d = h / this.tileTexture.height; 
    }
}