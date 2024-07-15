
import React, { useState } from "react";
import "./Add_Modal.css"
import axios from "axios";
import currency_symbols from "./currency_code";
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
  
export default function Add_Modal(props) {
    
    const [transaction, settransaction] = useState({description:"",currency:"AED",amount:"",date:""});
    if (!props.clicked) return null; 
    function resetTransaction() {
        settransaction({ description: "", currency: "AED", amount: "", date: "" });
    }
    function update_transaction(event) {
        const key = event.target.name;
        const value = event.target.value;
        settransaction({ ...transaction, [key]: value });
    }
    async function addtrans(){
        //insert my current trans into my db
        console.log(transaction);
        let result=await axios.post("/add", transaction);
        resetTransaction();
        if(result.data!="Successful") alert(result.data);
        if (result.data == "Successful") {
            result = (await axios.get("/getdata")).data;
            props.settrans(result);
        }
    
    }
    return (
        <div>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES} className="addmodal">
                <div className="addclose">
                    <p>Add Transaction</p>
                    <button onClick={() => { resetTransaction(); props.setclick(false) }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"   >
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg></button>
                </div>
                
                <div className="adddetails">
                    
                        <div className="additem1">
                            <input name="description" onChange={update_transaction} value={transaction.description} type="text" placeholder="Transaction Description" required></input>
                        </div>
                        <div className="additem2">
                            <div>
                                <select name="currency" onChange={update_transaction}>
                                    {Object.keys(currency_symbols).map((obj)=> <option value={obj}>{obj}</option>)}
                                </select>
                            </div>
                            <div>
                                <input type="number"  placeholder="Original Amount" name="amount" value={transaction.amount} onChange={update_transaction} required></input>
                            </div>
                        
                        </div>
                        <div className="additem3">
                            <input type="date"   name="date" value={transaction.date} onChange={update_transaction} required></input>
                        </div>
                        
                    </div>
                    <div className="addbuttons">
                        
                        <div>
                            <button onClick={() => { resetTransaction(); props.setclick(false) }} className="addcancel">CANCEL</button>
                        </div>
                        <div>
                        <button className="addsave" onClick={() => { addtrans(); props.setclick(false); }}>SAVE</button>
                        </div>
                        
                    </div>
               
                
            </div>
        </div>
        
    );
}
