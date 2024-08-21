import React from "react";
import "./Detail.css"




const Detail=(props)=> {

    function handleClick(event) {
        
        if (event.target.checked) {
            const arr = props.trans.slice(props.row_per_page * (props.page - 1), Math.min(props.trans.length, props.page * props.row_per_page));
            props.setAllChecked(!props.allChecked);
            arr.map((obj) => {   
                
                if (!props.selectedTrans.includes(obj.id)) {
                    props.selectedTrans.push(obj.id);
                }
                
            })

            props.setSelectedTrans(props.selectedTrans);
            
        }
        else {
            props.setAllChecked(!props.allChecked);
            const arr = props.trans.slice(props.row_per_page * (props.page - 1), Math.min(props.trans.length, props.page * props.row_per_page));

            let newArr = props.selectedTrans;
            arr.map((obj) => {
                newArr=newArr.filter((transId) => transId != obj.id);
            })
            
           
            props.setSelectedTrans(newArr);
        }
    }

    return (
        <div className="detail section">
            <div className="checkbox" ><input type="checkbox" checked={props.allChecked} onClick={handleClick}></input></div>
            <div className="date"><p>Date</p></div>
            <div className="description"><p>Description</p></div>
            <div className="org"><p>Original Amount</p></div>
            <div className="amount"><p>Amount in INR</p></div>
            <div className="action"></div>
        </div>
    )
}

export default Detail;