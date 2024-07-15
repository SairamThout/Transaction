import React, { useState, useEffect } from "react";
import "./Add_Modal.css";
import axios from "axios";
import currency_symbols from "./currency_code";

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

export default function Edit_Modal(props) {
  const [transaction, setTransaction] = useState({
    description: "",
    currency: "AED",
    amount: "",
    date: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get(`/get_by_id/${props.editbutton.id}`);
        const data = result.data;
        setTransaction({
          description: data.description || "",
          currency: data.currency || "AED",
          amount: data.amount || "",
          date: data.date || ""
        });
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    }

    if (props.editbutton.clicked) {
      fetchData();
    }
  }, [props.editbutton.id, props.editbutton.clicked]);

  if (!props.editbutton.clicked) return null;

  function resetTransaction() {
    setTransaction({ description: "", currency: "AED", amount: "", date: "" });
  }

  function updateTransaction(event) {
    const { name, value } = event.target;
    setTransaction({ ...transaction, [name]: value });
  }

  async function editTransaction() {
        try {
        // Implement your save logic here, e.g., axios.post('/save_transaction', transaction);
            
            let result=await axios.post(`/update/${props.editbutton.id}`,transaction);
            resetTransaction();
            props.setclick({ clicked: false, id: "" });
            alert(result.data);
            result = await axios.get('/getdata');
            props.settrans(result.data);
        } catch (error) {
            console.error("Error saving transaction:", error);
        }
  }

  return (
    <div>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES} className="addmodal">
        <div className="addclose">
          <p>Edit Transaction</p>
          <button onClick={() => { resetTransaction(); props.setclick({ clicked: false, id: "" }); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
        </div>

        <div className="adddetails">
          <div className="additem1">
            <input name="description" onChange={updateTransaction} value={transaction.description} type="text" placeholder="Transaction Description" required />
          </div>
          <div className="additem2">
            <div>
              <select name="currency" onChange={updateTransaction} value={transaction.currency}>
                {Object.keys(currency_symbols).map((obj) => <option key={obj} value={obj}>{obj}</option>)}
              </select>
            </div>
            <div>
              <input type="number" placeholder="Original Amount" name="amount" value={transaction.amount} onChange={updateTransaction} required />
            </div>
          </div>
          <div className="additem3">
            <input type="date" name="date" value={transaction.date} onChange={updateTransaction} required />
          </div>
        </div>

        <div className="addbuttons">
          <div>
            <button onClick={() => { resetTransaction(); props.setclick({ clicked: false, id: "" }); }} className="addcancel">CANCEL</button>
          </div>
          <div>
            <button className="addsave" onClick={() => { editTransaction(); }}>SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
}
