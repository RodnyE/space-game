
import { useState } from "react"
import http from "utils/http"

import AuthButton from "ui/AuthButton"
import TextField from "ui/TextField"
import Button from "ui/Button"

export default function App () {
    const [emailField, setEmailField] = useState("");
    const [passField, setPassField] = useState("");
    
    /**
     * Send login data to server
     */
    const sendLogin = () => {
        http.post({
            url: "/auth/login",
            body: {
                username: emailField,
                password: passField,
            }
        })
        .then(() => {
            
        })
    }
    
    return (
        <div className="w-100 vh-100 d-flex flex-column justify-content-center align-items-center">
            
            <div className="m-5">
                <TextField 
                    type="text" 
                    placeholder="Usuario:"
                    value={emailField}
                    onInput={(e) => setEmailField(e.target.value)}
                />
                <TextField 
                    type="password" 
                    placeholder="Contraseña:"
                    value={passField}
                    onInput={(e) => setPassField(e.target.value)}
                />
                <AuthButton 
                    className="d-flex p-2 justify-content-center"
                    onClick={sendLogin}
                > 
                    Acceder 
                </AuthButton>
            </div> 
            
            <AuthButton type="google"/>
            <AuthButton type="facebook"/>
            
        </div>
    )
}