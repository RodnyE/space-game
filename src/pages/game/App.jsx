
import { useState, useEffect } from "react"

import Button from "ui/Button"
import JoystickCtrl from "./controls/JoystickCtrl"
import Fullscreen from "ui/Fullscreen"
import GameRenderer from "ui/GameRenderer"

import { gx, initGameScene } from "engine/scene"
import Container from "gl/Container"
import loopHandler from "engine/loop"

// Application 
export default function App () {
    const [fullscreen, setFullscreen] = useState(false);
    const [play, setPlay] = useState(null);
    const [scene, setScene] = useState(null);
    
    useEffect(() => {
        if (gx.resources) {
            if (fullscreen) gx.resources.spaceSound.play();
            else gx.resources.spaceSound.pause();
        }
    }, [fullscreen]);
    
    /**
     * Event handler to ready GameRenderer
     * @param {PIXI.Renderer} renderer
     */
    const readyHandler = (renderer) => {
        initGameScene({
            width: renderer.width,
            height: renderer.height,
        })
        .then((scene) => {
            setScene(scene);
            setPlay(true);
        })
    };
    
    // Render
    return (<div>
        {!fullscreen &&
            <Button onClick={() => setFullscreen(true)}> Start </Button> 
        }
        
        {fullscreen && 
            <Fullscreen 
                fullscreen={fullscreen} 
                onFullscreen={(full) => setFullscreen(full)}
            >
                <GameRenderer 
                    scene={scene} 
                    height={500}
                    ratio={3/2}
                    play={play}
                    onLoop={loopHandler}
                    onReady={readyHandler}
                />  
                <JoystickCtrl 
                    style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem"
                    }}
                    onMove={(joy) => {gx.joy = joy}}
                />
            </Fullscreen>
        }
    </div>)
}