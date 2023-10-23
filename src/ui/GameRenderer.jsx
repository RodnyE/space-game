
import "./GameRenderer/style.css"
import {useRef, useState, useEffect} from "react"
import {
    Renderer, 
    Container, 
    Ticker,
} from "pixi.js" 


export default function GameRenderer ({
    ratio,
    height,
    scene,
    play,
    resolution = 1,
    onLoop = () => {},
    onRenderer = () => {},
    style = {},
}) {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const tickerRef = useRef(null);
    
    const canvas_height = height * resolution;
    const canvas_width = canvas_height * ratio;
    
    //
    // Startup
    //
    useEffect(() => {
        // Renderer
        const renderer = new Renderer({
            view: canvasRef.current,
            width: canvas_width,
            height: canvas_height,
        });
        rendererRef.current = renderer;
        onRenderer(rendererRef.current);
        
        // Renderer loop
        const ticker = new Ticker();
        ticker.add(() => {
            onLoop();
            renderer.render(scene);
        });
        tickerRef.current = ticker; 
    }, []);
    
    //
    // Loop for rendering
    //
    useEffect(() => { 
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