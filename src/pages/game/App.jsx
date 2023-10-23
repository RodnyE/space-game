
import { useState, useEffect } from "react"

import Button from "ui/Button"
import JoystickCtrl from "./controls/JoystickCtrl"
import Fullscreen from "ui/Fullscreen"
import GameRenderer from "ui/GameRenderer"

import { gx, createScene } from "engine/scene"
import Container from "gl/Container"
import loopHandler from "engine/loop"

// Application 
export default function App () {
    const [fullscreen, setFullscreen] = useState(false);
    const [scene, setScene] = useState(new Container());
    const [play, setPlay] = useState(null);
    
    // Mount GameRenderer
    const rendererHandler = (renderer) => {
        if (renderer) {
            gx.renderer = renderer;
            gx.joy = {x: 0, y: 0, s: 0}
            setScene(createScene());
            setPlay(true);
        }
    };
    
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
                    onRenderer={rendererHandler}
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