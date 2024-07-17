import React from "react";
import "./Drop-Down.css";

export default function Drop_Down(props) {
  function handleChange(event) {
      props.setrow(parseInt(event.target.value)); 
      props.setpage(1);
      
  }

  return (
    <div className="dropdown">
      <p style={{ display: "inline" }}>Rows per Page</p>
      <select name="page-number" onChange={handleChange}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
     
    </div>
  );
}
