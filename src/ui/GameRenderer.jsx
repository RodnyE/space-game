
import "./GameRenderer/style.css"
import {useRef, useState, useEffect} from "react"
import {
    Renderer, 
    Ticker,
} from "pixi.js" 

/**
 * PIXI Game component wrapper
 * 
 * @param {number} height - view height
 * @param {number} ratio - view ratio 
 * @param {number} resolution - view scale
 * @param {PIXI.Container} scene - scene to render
 * @param {boolean} play - render and loop scene
 * @param {function} onLoop - handle update scene
 * @param {function} onReady - handle ready scene
 */
export default function GameRenderer ({
    height,
    resolution = 1,
    
    scene, renderTexture,
    play,
    onLoop = () => {},
    onReady = () => {},
    style = {},
}) {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const tickerRef = useRef(null);
    
    const ratio = Math.max(screen.width, screen.height) / Math.min(screen.width, screen.height);
    const canvas_height = height * resolution;
    const canvas_width = canvas_height * ratio;
    
    //
    // Startup renderer
    //
    useEffect(() => {
        const renderer = new Renderer({
            view: canvasRef.current,
            width: canvas_width,
            height: canvas_height,
        });
        rendererRef.current = renderer;
        onReady(renderer);
    }, []);
    
    //
    // Renderer loop
    //
    useEffect(() => {
        if (!scene || !onLoop) return;
        
        const ticker = new Ticker();
        const renderer = rendererRef.current;
        ticker.add(() => {
            onLoop();
            renderer.render(scene, {renderTexture});
        });
        
        // set new ticker
        if (tickerRef.current) tickerRef.current.destroy();
        tickerRef.current = ticker; 
    }, [scene, onLoop]);
    
    //
    // Loop for rendering
    //
    useEffect(() => { 
        if (!tickerRef.current) return;
        
        if (play) tickerRef.current.start();
        else tickerRef.current.stop();
    }, [play])
    
    
    return (
        <div className="game-container">
            <canvas 
                className="game-view"
                ref={canvasRef}
                style={style}
            />
        </div>
    )
}