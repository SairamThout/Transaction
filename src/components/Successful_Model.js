import React, { useState } from "react";



const MODAL_STYLES = {
    position: 'fixed',
    width: '336px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    zIndex: 1000
};

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
};

const styles = {
    display: "block",
    height: "36px",
    width: "88px",
    background: "rgba(98, 0, 238, 1)",
    borderRadius: "5px",
    border: 0,
    color: "white"
};



export default function Successful_Model(props) {
    
   

    if (!props.clicked) return null;

    return (
        <div>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className="uploadmodel">
            <div className="uploadclose">
                <p>CSV Uploaded</p>
                <button onClick={() => props.setclick(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                </button>
            </div>
                <div className="uploaddetails">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="30" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <div>
                    <p>Uploading Successful !</p>
                </div>
                <div className="uploadbutton">
                   
                
                </div>
            </div>
        </div>
    </div>
    )
}
