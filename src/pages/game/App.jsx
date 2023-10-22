
import {useState} from "react"
import Button from "ui/Button"
import JoystickCtrl from "./controls/JoystickCtrl"
import Fullscreen from "ui/Fullscreen"
import GameRenderer from "ui/GameRenderer"

import spaceImg from "assets/outer-space-6988255_960_720.jpg"

// Application 
export default function App () {
    const [fullscreen, setFullscreen] = useState(false);
    
    return (<div>
        {!fullscreen &&
            <Button onClick={() => setFullscreen(true)}> Start </Button> 
        }
        
        {fullscreen && 
            <Fullscreen 
                fullscreen={fullscreen} 
                onFullscreen={(full) => setFullscreen(full)}
            >
                <div style={{
                    width: "100%",
                    height: "100%",
                    background: "url(" + spaceImg + ")"
                }}/>  
                <JoystickCtrl 
                    style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem"
                    }}
                    onMove={()=>{}}
                />
            </Fullscreen>
        }
    </div>)
}