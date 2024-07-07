import React from "react";
import "./Detail.css"

function Detail() {
    return (
        <div className="detail">
            <div className="checkbox"><input type="checkbox"></input></div>
            <div className="date"><p>Date</p></div>
            <div className="description"><p>Description</p></div>
            <div className="org"><p>Original Amount</p></div>
            <div className="amount"><p>Amount in INR</p></div>
            <div className="action"></div>

        </div>
    )
}

export default Detail;