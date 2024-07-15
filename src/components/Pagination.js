import React from "react";
import "./Pagination.css"
import Jump_Buttons from "./Jump_Buttons";
import Drop_Down from "./Drop_Down";
export default function Pagination(props) {
    return (<div className="pagination">
        <div><Drop_Down setrow={props.setrow} trans={props.trans} setpage={props.setpage} page={props.page}></Drop_Down></div>
        <div><Jump_Buttons page={props.page} setpage={props.setpage} trans={props.trans} row={props.row} /></div>
        
        
    </div>);
};