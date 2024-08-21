import React, { useState } from "react";
import "./transaction.css";
import axios from "axios";
import currencySymbols from "./currency_code";
import { toast,Bounce } from "react-toastify";

const Transaction = ({ trans, settrans, setedit, page, row, selectedTrans, setSelectedTrans }) => {

    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            if (!selectedTrans.includes(id)) {
                setSelectedTrans([...selectedTrans, id]);
            }
        } else {
            setSelectedTrans(selectedTrans.filter(transId => transId !== id));
        }
    };

    async function deletetrans(event) {
        const id = parseInt(event.currentTarget.value);

        try {
            const response = await axios.delete(`/transaction/${id}`);
            toast.success(response.data.status, {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            const new_trans = trans.filter((obj) => {
                return (obj.id !== id);
            });
            settrans(new_trans);
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }

    function do_necessary(event) {
        const id = event.currentTarget.value;
        setedit({ clicked: true, id: id });
    }

    function print(obj) {
        if (!obj) return null;
        return (
            <div className="detail" key={obj.id}>
                <div className="checkbox"><input type="checkbox" checked={selectedTrans.includes(obj.id)} onChange={(e) => handleCheckboxChange(e, obj.id)}></input></div>
                <div className="date"><p>{obj.date}</p></div>
                <div className="description" title={obj.description}>
                    <p>{(obj.description.length > 20) ? obj.description.slice(0, 20) + "..." : obj.description}</p>
                </div>
                <div className="org"><p>{currencySymbols[obj.currency] + " " + obj.amount}</p></div>
                <div className="amount"><p>₹ {obj.inramount.toFixed(2)}</p></div>
                <div className="action">
                    {selectedTrans.length ? null : <button className="edit-btn" name="edit" value={obj.id} onClick={do_necessary}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>}
                    {selectedTrans.length ? null : <button className="delete-btn" name="delete" value={obj.id} onClick={deletetrans}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg>
                    </button>}
                </div>
            </div>
        );
    }

    return (
        <div className="transaction">
            {trans.slice(row * (page - 1), Math.min(trans.length, page * row)).map(print)}
        </div>
    );
}

export default Transaction;
