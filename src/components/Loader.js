import React, { useState } from "react";
import "./Loader.css"
import ProgressBar from 'react-bootstrap/ProgressBar';

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



export default function Loader(props) {
    
    if (props.clicked) return null;

    return (
        <div>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES} className="uploadmodel">
                <div className="uploadclose">
                    <p>Uploading CSV</p>
                    
                </div>
                <div className="uploaddetails">
                    
                    <div className="uploadbutton loader">
                        <ProgressBar now={props.percentage} animated label={props.percentage+"%"} />
                    </div>
                </div>
            </div>
        </div>
    )
}
