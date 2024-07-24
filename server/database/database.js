import axios from "axios";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database:'transaction',
    password: 'Arya@9461',
    port:5432
  })
db.connect();


import dbError from "./db_errors.js";




async function getAllTransactions() {
    
    try {
        const result = await db.query("Select * from transaction order by id desc");
        return result.rows;
    }
    catch (error) {
        console.error(dbError.fetch, error);
        throw { status: 500, message: dbError.fetch };
    }
    
    
}


async function getTransactionById(id) {

    try {
        const result = await db.query('SELECT * FROM transaction WHERE id = $1', [id]);

        if (result.rowCount) {
            return result.rows;
        }
        else {
            throw { status: 400, message: dbError.id(id) };
        }
    }
    catch (error) {
        console.log(dbError.fetch, error);
        throw (error.status?error:{ status: 500, message: dbError.fetch });
    }
    

}


async function addTransaction(transaction) {

    try {
        const result = await db.query("Insert into transaction (date,description,amount,currency,inr_amount) values($1,$2,$3,$4,$5) returning *", [transaction.Date, transaction.Description, transaction.Amount, transaction.Currency,transaction.inrAmount]);
        return result.rows[0];
    }
    catch (error) {
        console.log(dbError.insert, error);
        throw (error.status?error:{ status: 500, message: dbError.insert});
    }

    
}


async function updateTransaction(transaction,id) {
    
    try {
        const result = await db.query("Update transaction set date=$1,description=$2,amount=$3,currency=$4,inr_amount=$5 where id=$6 returning *",[transaction.Date,transaction.Description,transaction.Amount,transaction.Currency,transaction.inrAmount,id]);
        
        if (result.rowCount) {
            return result.rows[0];
        }
        else {
            throw { status: 400, message: dbError.id(id) };
        }
    }
    catch (error) {
        console.log(dbError.update, error);
        throw (error.status?error:{ status: 500, message: dbError.update});
    }

    



}


async function addBatchTransaction(transaction) {
    
   
    const queryText = `INSERT INTO transaction (date, description, amount, currency, inr_amount)
    VALUES ${transaction.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(',')}
    RETURNING *`;

    const values = transaction.flatMap(item => [item.Date, item.Description, item.Amount, item.Currency, item.inr_amount]);
    try {
        const result = await db.query(queryText, values);
        return result.rows;
    }
    catch (error) {
        console.log(dbError.insert, error);
        throw (error.status?error:{ status: 500, message: dbError.insert});
    }
   
    

    

}


async function deleteTransaction(id) {

    try {
        const result=await db.query(`Delete from transaction where id=${id}`);
        
        if (result.rowCount) {
            return { status: "Deleted Successfully" };
        }
        else {
            throw { status: 400, message: dbError.id(id)};
        }
    }
    catch (error) {
        console.log(dbError.delete, error);
        throw (error.status?error:{ status: 500, message:dbError.delete});
    }

}


export default { getAllTransactions, getTransactionById, addTransaction, updateTransaction, deleteTransaction,addBatchTransaction };