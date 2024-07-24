import React, { useState, useEffect } from "react";
import "./Add_Modal.css";
import axios from "axios";
import currency_symbols from "./currency_code";
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


function convertDateFormat(dateString) {
  // Split the input string by '-'
  var parts = dateString.split('-');
  
  // Rearrange the parts array to YYYY-MM-DD format
  var yyyy = parts[2];
  var mm = parts[1];
  var dd = parts[0];
  
  // Concatenate the rearranged parts into a new date string
  var yyyyMMdd = yyyy + '-' + mm + '-' + dd;
  
  return yyyyMMdd;
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

export default function Edit_Modal(props) {
  const [transaction, setTransaction] = useState({ Description: "", Currency: "AED", Amount: "", Date: "" });
  
  useEffect(() => {
    
    
    const fetchData = async function (id) {
     
      try {
        const result = (await axios.get(`/transaction/${id}`)).data.data;
       
        setTransaction({
          Description: result[0].description ,
          Currency: result[0].currency ,
          Amount: result[0].amount ,
          Date: convertDateFormat(result[0].date) ,
        });
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    }
    if (props.editbutton.clicked) {
      const id = props.editbutton.id;
      fetchData(id);
    }
  }, [props.editbutton.clicked]);

  if (!props.editbutton.clicked) return null;

  function resetTransaction() {
    setTransaction({ Description: "", Currency: "AED", Amount: "", Date: "" });
    props.seteditbutton({ clicked: false, id: "" });
  }

  function updateTransaction(event) {
    const { name, value } = event.target;
    setTransaction({ ...transaction, [name]: value });
  }

  async function editTransaction() {
    transaction.Date = convertDateFormat1(transaction.Date);
    try {
      let new_obj = (await axios.put(`/transaction/${props.editbutton.id}`, transaction)).data.data;
      
      console.log(new_obj);

      props.settrans((trans) => {
          const new_trans = trans.map((obj) => {
            if (obj.id === new_obj.id) {
              return new_obj;
            } else {
              return obj;
            }
          });

          return new_trans;
      });

      toast.success("Edited Successfully");
      resetTransaction();
    } catch (error) {
      
      toast.error(error.response.data.message);
    }
    resetTransaction();
  }

  return (
    <div>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES} className="addmodal">
        <div className="addclose">
          <p>Edit Transaction</p>
          <button onClick={() => { resetTransaction(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
        </div>

        <div className="adddetails">
          <div className="additem1">
            <input name="Description" onChange={updateTransaction} value={transaction.Description} type="text" placeholder="Transaction Description" required />
          </div>
          <div className="additem2">
            <div>
              <select name="Currency" onChange={updateTransaction} value={transaction.Currency}>
                {Object.keys(currency_symbols).map((obj) => <option key={obj} value={obj}>{obj}</option>)}
              </select>
            </div>
            <div>
              <input type="number" placeholder="Original Amount" name="Amount" value={transaction.Amount} onChange={updateTransaction} required />
            </div>
          </div>
          <div className="additem3">
            <input type="date" name="Date" value={transaction.Date} onChange={updateTransaction} required />
          </div>
        </div>

        <div className="addbuttons">
          <div>
            <button onClick={() => { resetTransaction(); }} className="addcancel">CANCEL</button>
          </div>
          <div>
            <button className="addsave" onClick={() => { editTransaction(); }}>SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
}
