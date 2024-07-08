import React from "react";
import "./Upload_Model.css"
const MODAL_STYLES = {
    position: 'fixed',
    width:'336px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    zIndex: 1000
  }
  
  const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
  }
export default function Upload_Model(props) {
    if (!props.clicked) return null; 
    return (
        <div>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES} className="uploadmodel">
                <div className="uploadclose" >
                        <p>Upload CSV</p>
                    <button onClick={()=>props.setclick(false)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg></button>
                </div>
                <div className="uploaddetails">
                    <div>
                        <p>Select and upload your csv here</p>
                    </div>
                    <div>
                        <button>UPLOAD</button>
                    </div>
                </div>
            </div>
        </div>
    )
}