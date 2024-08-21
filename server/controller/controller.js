
import services from "../service/services.js";

import multer from "multer";
import csvParser from "csv-parser"
import fs from "fs";
import message from "./message.js";
const upload = multer({ dest: "uploads/" });




async function getAllTransactions(req, res) {
    try {
        const transactions = await services.getAllTransactions(); 
        res.json({ status:message.ok, data: transactions });
    }
    catch (error) {
        res.status(error.status).json({ status:message.failed, message: error.message });
    }
}


async function getTransactionById(req, res) {

    const { id } = req.params;

    try {
        const transaction = await services.getTransactionById(id);
        res.json({status:message.ok, data: transaction});
    }
    catch (error) {
        res.status(error.status).json({ status:message.failed, message: error.message });
    }
    
}


async function addTransaction(req, res) {
 

    const transaction = req.body;

    //if new transaction to be added has all details correct then insert the data into database by using add transaction service
    try {
        const addedTransaction = await services.addTransaction(transaction);
        res.json({ status:message.added, data: addedTransaction });    
    }
    catch (error) {
        res.status(error.status).json({ status:message.failed, message: error.message });
    }
    

}


async function addCsvTransaction(req, res) {
    const filePath = req.file.path;
    
    const result = [];

    fs.createReadStream(filePath)
        .pipe(csvParser({
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, '') // Handle BOM
        }))
        .on("data",(row) => {
            result.push(row);
        })
        .on("end", async () => {
            try {
                const addedTransaction =await services.addCsvTransaction(result);
                res.json({ status:message.csvUploaded, data: addedTransaction });
            }
            catch (error) {
                res.status(error.status).json({ status: message.failed, message: error.message });
            }
            
        })
            
}


async function updateTransaction(req, res) {

    const transaction = req.body;
    const { id } = req.params;
    
    try {
        const updatedTransaction = await services.updateTransaction(transaction,id);
        res.json({ status: message.updated, data: updatedTransaction });  

    }
    catch (error) {
        res.status(error.status).json({ status:message.failed, message: error.message });
    }


    

}




async function deleteTransaction(req, res) {
    const { id } = req.params;
    //check if the data corresponding to this id exists in my db
    try {
        const result=await services.deleteTransaction(id);
        res.json({ status: message.deleted, message: result });
    }
    catch (error) {
        res.status(error.status).json({ status: message.failed, message: error.message });
    }
    
}

async function batchDelete(req,res) {
    let arr = req.body;
    if (req.body.selectedTrans) {
        arr = req.body.selectedTrans;
    }

    try {
        const result = await services.batchDelete(arr);
        res.json({ status: message.deleted, message: result });
    }
    catch (error) {
        if (isCustomError(error)) {
            res.status(error.status || 500).json({ status: message.failed, message: error.message });
        } else {
            res.status(500).json({ status: message.failed, message: 'An unexpected error occurred' });
        }
    }
}

export default {batchDelete, getAllTransactions, getTransactionById, addTransaction, updateTransaction, deleteTransaction,addCsvTransaction };

