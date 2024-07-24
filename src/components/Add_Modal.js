
import React, { useState } from "react";
import "./Add_Modal.css"
import axios from "axios";
import { toast } from "react-toastify";
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
function convertDateFormat1(dateString) {
// Split the input string by '-'
    var parts = dateString.split('-');

    // Rearrange the parts array to DD-MM-YYYY format
    var yyyy = parts[0];
    var mm = parts[1];
    var dd = parts[2];

    // Concatenate the rearranged parts into a new date string
    var ddMMyyyy = dd + '-' + mm + '-' + yyyy;

    return ddMMyyyy;
}
   
export default function Add_Modal(props) {
    
    const [transaction, settransaction] = useState({Description:"",Currency:"AED",Amount:"",Date:""});
    if (!props.clicked) return null; 
    function resetTransaction() {
        settransaction({Description:"",Currency:"AED",Amount:"",Date:""});
        props.setclick(false);
    }
    function update_transaction(event) {
        const key = event.target.name;
        const value = event.target.value;
        settransaction({...transaction,[key]:value});
    }
    async function addtrans(){
        transaction.Date = convertDateFormat1(transaction.Date);
        try {
            let result = await axios.post("/transaction", transaction);
            props.settrans((prev) => [result.data.data, ...prev]);
            toast.success("Transaction Added");
        }
        catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
        resetTransaction();
       
    }
    return (
        <div>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES} className="addmodal">
                <div className="addclose">
                    <p>Add Transaction</p>
                    <button onClick={() => { resetTransaction(); }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"   >
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg></button>
                </div>
                
                <div className="adddetails">
                    
                        <div className="additem1">
                            <input name="Description" onChange={update_transaction} value={transaction.Description} type="text" placeholder="Transaction Description" required></input>
                        </div>
                        <div className="additem2">
                            <div>
                                <select name="Currency" onChange={update_transaction}>
                                    {Object.keys(currency_symbols).map((obj)=> <option value={obj}>{obj}</option>)}
                                </select>
                            </div>
                            <div>
                                <input type="number"  placeholder="Original Amount" name="Amount" value={transaction.Amount} onChange={update_transaction} required></input>
                            </div>
                        
                        </div>
                        <div className="additem3">
                            <input type="date"   name="Date" value={transaction.Date} onChange={update_transaction} required></input>
                        </div>
                        
                    </div>
                    <div className="addbuttons">
                        
                        <div>
                            <button onClick={() => { resetTransaction();  }} className="addcancel">CANCEL</button>
                        </div>
                        <div>
                        <button className="addsave" onClick={() => { addtrans();}}>SAVE</button>
                        </div>
                        
                    </div>
               
                
            </div>
        </div>
        
    );
}
