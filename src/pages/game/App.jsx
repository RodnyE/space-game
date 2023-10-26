
import { useState, useEffect } from "react"

import Button from "ui/Button"
import JoystickCtrl from "./controls/JoystickCtrl"
import Fullscreen from "ui/Fullscreen"
import GameRenderer from "ui/GameRenderer"

import { getGameContext, initGameContext } from "engine/scene"

// Application 
export default function App () {
    const [fullscreen, setFullscreen] = useState(false);
    const [play, setPlay] = useState(null);
    const [gx, setGX] = useState({});
    
    let _gx = gx;
    
    useEffect(() => {
        if (gx && gx.music) {
            if (fullscreen) gx.music.play();
            else gx.music.pause();
        }
    }, [fullscreen]);
    
    /**
     * Event handler on joystick
     */
    const moveJoystickHandler = (joy) => {
        gx.joy = joy;
    }
    
    /**
     * Event handler to ready GameRenderer
     * @param {PIXI.Renderer} renderer
     */
    const readyHandler = (renderer) => {
        if(getGameContext()) return;
        
        initGameContext({
            width: renderer.width,
            height: renderer.height,
        })
        .then((gx) => {
            _gx = gx;
            setGX(gx);
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
                global={true}
                fullscreen={fullscreen} 
                onFullscreen={(full) => setFullscreen(full)}
            >
                <GameRenderer 
                    scene={gx.scene} 
                    height={500}
                    ratio={3/2}
                    play={play}
                    onLoop={gx.loop}
                    onReady={readyHandler}
                />  
                <JoystickCtrl 
                    style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem"
                    }}
                    onMove={(joy) => {_gx.joy = joy}}
                />
            </Fullscreen>
        }
    </div>)
}