import React, { useState } from "react";
import "./Upload_Model.css"
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";
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


function transformArray(arr) {
    return arr.map(obj => {
        // Convert keys to lowercase
        const newObj = {};
        for (let key in obj) {
            newObj[key.toLowerCase()] = obj[key];
        }

        // Convert date format if 'date' key exists and is valid
        if (newObj.hasOwnProperty('date')) {
            const dateParts = newObj.date.split('-');
            if (dateParts.length === 3) {
                const day = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10);
                const year = parseInt(dateParts[2], 10);

                // Validate if it's a valid date
                const isValidDate = !isNaN(day) && !isNaN(month) && !isNaN(year) &&
                                    day >= 1 && day <= 31 &&
                                    month >= 1 && month <= 12 &&
                                    year >= 1000 && year <= 9999;

                if (isValidDate) {
                    // Check if it's not a future date
                    const inputDate = new Date(year, month - 1, day); // month - 1 because months are 0-indexed in Date constructor
                    const currentDate = new Date();
                    if (inputDate <= currentDate) {
                        // Format date as yyyy-mm-dd
                        newObj.date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    }
                }
            }
        }

        return newObj;
    });
}





export default function UploadModel(props) {
   


    
   
    async function handleFile(event) {
       
        props.setcsvdatauploaded(false);
        
        Papa.parse(event.currentTarget.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async function (result) {
                const arr = transformArray(result.data);
               
                try {
                    
                    const response = await axios.post("/add", arr);
                    props.settrans((prev) => [...(response.data), ...prev]);
                    props.setcsvdatauploaded(true);
                    props.setsuccessfulclick(true);
                }
                catch (err) {
                    toast.error(err.response.data);
                    props.setcsvdatauploaded(true);
                    props.setunsuccessfulclick(true);
                }
                
            }
        });
       
        props.setclick(false);
        
        
    }

    if (!props.clicked) return null;

    return (
        <div>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES} className="uploadmodel">
                <div className="uploadclose">
                    <p>Upload CSV</p>
                    <button onClick={() => props.setclick(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                    </button>
                </div>
                <div className="uploaddetails">
                    <div>
                        <p>Select and upload your csv here</p>
                    </div>
                    <div className="uploadbutton">
                        <label htmlFor="fileupload" style={styles}>
                            <div>
                                <p>UPLOAD</p>
                            </div>
                        </label>
                        <input id="fileupload" type="file" name="fieldname" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
