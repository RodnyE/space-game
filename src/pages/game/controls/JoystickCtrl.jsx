
import { useRef, useEffect } from "react";

/**
 * JoystickCtrl component for controlling movement with a virtual joystick.
 *
 * @param {number} size - The size of the joystick in pixels.
 * @param {function} onMove - Callback function called when joystick moves. Receives an object with properties x, y, and s.
 */
export default function JoystickCtrl({
    size = 150,
    onMove = ({ x, y, s }) => console.log(x, y, s),
    className,
    style = {},
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const offsetParent = canvas.parentNode;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#ffffff";
        
        // Relative percentage position (-1 to 1)
        let x = 0; 
        let y = 0;
        let s = 0; // Center distance to position
        let pressed = false; // joystick is pressed

        const center = size / 2;
        const radius = size / 2;
        const joyRadius = size / 4;
        const joyMax = radius - joyRadius; // Maximum distance joystick can move from center

        // Relative position
        let joyX = center; 
        let joyY = center;
        let offsetX = offsetParent.offsetLeft; 
        let offsetY = offsetParent.offsetTop;

        /**
         * Event handler for when the user starts interacting with the joystick.
         */
        function startHandler() {
            pressed = true;
            onMove({ x, y, s });
        }

        /**
         * Event handler for when the user is moving the joystick.
         */
        function moveHandler(event) {
            const e = event.targetTouches ? event.targetTouches[0] : event;

            // Relative touch position
            const touchX = e.pageX - offsetX;
            const touchY = e.pageY - offsetY;

            // Distance from touch position to center
            const sideX = touchX - radius;
            const sideY = touchY - radius; 
            const radian = Math.atan2(sideY, sideX); // Angle relative to the center

            // Check if joystick is colliding with the border of the canvas
            if (sideX * sideX + sideY * sideY >= joyMax * joyMax) {
                joyX = joyMax * Math.cos(radian);
                joyY = joyMax * Math.sin(radian);
            } else {
                joyX = Math.abs(sideX) > joyMax ? joyMax : Math.abs(sideX);
                joyY = Math.abs(sideY) > joyMax ? joyMax : Math.abs(sideY);
            }

            // Update joystick position based on touch position
            if (sideX < 0) joyX = - Math.abs(joyX);
            if (sideY < 0) joyY = - Math.abs(joyY);
            joyX += radius;
            joyY += radius;

            // Calculate relative x, y positions and strench value
            x = (joyX - center) / joyMax;
            y = (joyY - center) / joyMax;
            s = Math.sqrt(x * x + y * y);
            s = s > 0.9999999 ? 1 : s;
            
            offsetX = offsetParent.offsetLeft; 
            offsetY = offsetParent.offsetTop;

            draw();
            onMove({ x, y, s });
        }

        /**
         * Event handler for when the user stops interacting with the joystick.
         */
        function endHandler() {
            pressed = false;
            joyX = center;
            joyY = center;
            x = 0;
            y = 0;
            s = 0;
            draw();
            onMove({ x, y, s });
        }

        /**
         * Draw the joystick on the canvas.
         */
        function draw() {
            ctx.clearRect(0, 0, size, size);

            // External circle
            ctx.beginPath();
            ctx.arc(center, center, radius * 3 / 4, 0, Math.PI * 2, false);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();

            // Internal circle
            ctx.beginPath();
            ctx.arc(joyX, joyY, joyRadius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }

        // Set event listeners for touch and mouse interactions
        canvas.addEventListener("touchstart", startHandler);
        canvas.addEventListener("touchmove", moveHandler);
        canvas.addEventListener("touchend", endHandler);
        canvas.addEventListener("mousedown", startHandler);
        canvas.addEventListener("mousemove", moveHandler);
        canvas.addEventListener("mouseup", endHandler);

        // Initial draw
        draw();
        
        // Unmount component
        return () => { 
            canvas.removeEventListener("touchstart", startHandler);
            canvas.removeEventListener("touchmove", moveHandler);
            canvas.removeEventListener("touchend", endHandler);
            canvas.removeEventListener("mousedown", startHandler);
            canvas.removeEventListener("mousemove", moveHandler);
            canvas.removeEventListener("mouseup", endHandler); 
            
            onMove = null;
        }
    }, []);

    return (
        <div 
            className={className}
            style={Object.assign({}, style, { 
                width: size + "px", 
                height: size + "px",
            })}
        >
            <canvas 
                ref={canvasRef} 
                style={{opacity: 0.3}}
                width={size}
                height={size} 
            />
        </div>
    );
}