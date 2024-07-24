
import db from "../database/database.js"
import axios from "axios";


let currency_data = null;

const url = "http://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json";

const supportError = (currency) => `We currently don't support the currency : ${transaction.Currency}`;
const apiError = "Error while fetching data from API";







//function to get conversion rate
async function getConversion(transaction) {
    if (currency_data != null) {
        if(currency_data.data.inr[ transaction.Currency.toLowerCase()]) {
            const conversion = currency_data.data.inr[ transaction.Currency.toLowerCase()];
            return transaction.Amount/conversion;
        }
        else {
            throw { status: 500, message:supportError};
        }
    }
    try {
        currency_data = await axios.get(url);
        if(currency_data.data.inr[ transaction.Currency.toLowerCase()]) {
            const conversion = currency_data.data.inr[ transaction.Currency.toLowerCase()];
            return transaction.Amount/conversion;
        }
        else {
            throw { status: 500, message: supportError };
        }
        
    }
    catch(error) {

        throw error.status?error:{ status: 500, message:apiError};
    }
    
}



async function getAllTransactions() {
    try {
        const result = await db.getAllTransactions();
        return result;
    }
    catch (error) {
        throw error;
    }
    
}


async function getTransactionById(id) {
    try {
        const result = await db.getTransactionById(id);
        return result;
    }
    catch (error) {
        throw error;
    }
    
}

async function addTransaction(transaction) {
    
    //get the transaction inr_amount
    try {
        transaction.inrAmount = await getConversion(transaction);
        try {
            const addedTransaction =await db.addTransaction(transaction);
            return addedTransaction;
        }
        catch (error) {
            throw error;
        }
    }
    catch (error) {
        throw error;
    }
    

    
}


async function addCsvTransaction(transaction) {
    //we will add these transaction in batch size
    
    
    for (let i = 0; i < transaction.length; i++){
        
        try {
            transaction[i].inr_amount = await getConversion(transaction[i]);
        }
        catch (error) {
            throw error;
        }
        
    }

    try {
        let addedCsvTransactions = await db.addBatchTransaction(transaction);
        return addedCsvTransactions;
    }
    catch (error) {
        throw error;
    }

    
}



async function updateTransaction(transaction, id) {

    //get the transaction inr_amount
    try {
        transaction.inrAmount = await getConversion(transaction);
        try {
            const updatedTransaction = await db.updateTransaction(transaction, id);
            return updatedTransaction;
        }
        catch (error) {
            throw error;
        }
    }
    catch (error) {
        throw error;
    }
    
    
    

}


async function deleteTransaction(id) {
   
    try {
        const result = await db.deleteTransaction(id);
        return result;
    }
    catch (error) {
        throw error;
    }

}


export default { getAllTransactions, getTransactionById, addTransaction, updateTransaction, deleteTransaction,addCsvTransaction };
