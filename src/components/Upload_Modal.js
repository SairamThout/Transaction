import React, { useState } from "react";
import "./Upload_Model.css"
import Papa from "papaparse";
import axios from "axios";

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

function isValidDescription(description) {
    return description.trim() !== '';
}

function isValidAmount(amount) {
    let parsedAmount = parseFloat(amount);
    return !isNaN(parsedAmount) && parsedAmount > 0;
}

function isValidDate(dateStr) {
    if (dateStr.trim() !== '') {
        let date = new Date(dateStr);
        let currentDate = new Date();
        return date <= currentDate;
    }
    return false;
}

function convertDateFormat(dateString) {
    const trimmedDateString = dateString.trim();
    const parts = trimmedDateString.split('-');
    if (parts.length !== 3) {
        return null; // Handle invalid date format
    }
    const year = parts[2];
    const month = parts[0];
    const day = parts[1];
    const date = new Date(year, month - 1, day);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}

function convertKeysToLowerCase(obj) {
    if (!obj || typeof obj !== 'object') {
        throw new Error('Invalid input. Expected an object.');
    }

    const keys = Object.keys(obj);
    const lowerCaseObject = {};

    keys.forEach(key => {
        lowerCaseObject[key.toLowerCase()] = obj[key];
    });

    return lowerCaseObject;
}



export default function UploadModel(props) {
   


    
   
    async function handleFile(event) {
       
        props.setcsvdatauploaded(false);
        let isValid = true;
        const parsedData = [];

        Papa.parse(event.currentTarget.files[0], {
            header: true,
            skipEmptyLines: true,
            step: function (row) {
                let obj = convertKeysToLowerCase(row.data);
                obj.date = convertDateFormat(obj.date);

                // Validate each row
                if (!isValidAmount(obj.amount) || !isValidDate(obj.date) || !isValidDescription(obj.description)) {
                    isValid = false;
                    
                } else {
                    parsedData.push(obj);
                }
            },
            complete: async function (result) {
                
                if (!isValid) {
                    
                    props.setcsvdatauploaded(true);
                    props.setunsuccessfulclick(true);

                } else {
                    let j = 1;
                    try {   
                        parsedData.map(async (data) => {
                            
                            const result = await axios.post("/add", data);
                            props.setpercentage(Math.round((j / parsedData.length) * 100));
                            j++;
                        })
                        try {
                            const result = await axios.get("/getdata");
                            props.settrans(result.data);
                            props.setsuccessfulclick(true);
                            props.setcsvdatauploaded(true);
                        }
                        catch(err) {
                            console.log("error fetching row after csv upload");
                            props.setcsvdatauploaded(true);
                            props.setunsuccessfulclick(true);
                        }
                    }
                    catch (err) {
                        console.log("Error while inserting data");
                        props.setcsvdatauploaded(true);
                        props.setunsuccessfulclick(true);
                    }

                }
               
            }
        });
       
       


        props.setclick(false);
        props.setpercentage(0);
        
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
