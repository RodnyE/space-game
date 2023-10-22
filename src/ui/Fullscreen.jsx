import {useState, useRef, useEffect} from "react"

/**
 * FullScreen API handler component 
 * 
 * @param {boolean} fullscreen - enable and disable fullscreen 
 * @param {function} onFullscreen
 */
export default function FullScreen ({
    fullscreen,
    onFullscreen,
    children
}) {
    const elementRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(fullscreen);
    
    // Mount component
    useEffect(() => {
        /** 
         * Fullscreen handler 
         */
        function fullscreenHandler () {
            if (
               document.fullscreenElement ||
               document.mozFullScreenElement ||
               document.msFullscreenElement ||
               document.webkitFullscreenElement
            ) {
                onFullscreen(true);
                setIsFullscreen(true);
            }
            else {
                onFullscreen(false);
                setIsFullscreen(false);
            }
        }
        
        document.addEventListener("fullscreenchange", fullscreenHandler);
        document.addEventListener("mozfullscreenchange", fullscreenHandler);
        document.addEventListener("MSFullscreenChange", fullscreenHandler);
        document.addEventListener("webkitfullscreenchange", fullscreenHandler);
        
        // Unmount component
        return () => {
            document.removeEventListener("fullscreenchange", fullscreenHandler);
            document.removeEventListener("mozfullscreenchange", fullscreenHandler);
            document.removeEventListener("MSFullscreenChange", fullscreenHandler);
            document.removeEventListener("webkitfullscreenchange", fullscreenHandler);
        };
    }, []);
    
    //
    // Prop fullscreen change
    //
    useEffect(() => {
        const element = elementRef.current;
        const requestFullscreen = 
            element.requestFullscreen ||
            element.mozRequestFullScreen ||
            element.msRequestFullscreen ||
            element.webkitRequestFullscreen;
        const exitFullscreen =  
            document.exitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen ||
            document.webkitExitFullscreen;
        
        if (fullscreen) requestFullscreen.bind(element)();
        else exitFullscreen.bind(document)();
    }, [fullscreen]);

    

    return (
        <div ref={elementRef}>
            {children}
        </div>
    );
};