import db from "../index.js"


async function getAllTransactions() {
    
    try {
        const result = await db.query(`Select * from transaction where ispresent=${1} order by id desc `);
        return result.rows;
    }
    catch (error) {
        console.error(dbError.fetch, error);
        throw { status: 500, message: dbError.fetch };
    }
    
    
}


async function getTransactionById(id) {

    try {
        const result = await db.query('SELECT * FROM transaction WHERE id = $1 and ispresent=$2', [id,1]);

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
        const result = await db.query("Insert into transaction (date,description,amount,currency,inramount) values($1,$2,$3,$4,$5) returning *", [transaction.Date, transaction.Description, transaction.Amount, transaction.Currency,transaction.inrAmount]);
        return result.rows[0];
    }
    catch (error) {
        console.log(dbError.insert, error);
        throw (error.status?error:{ status: 500, message: dbError.insert});
    }

    
}


async function updateTransaction(transaction,id) {
    
    try {
        const result = await db.query("Update transaction set date=$1,description=$2,amount=$3,currency=$4,inramount=$5 where id=$6 and ispresent=$7 returning *",[transaction.Date,transaction.Description,transaction.Amount,transaction.Currency,transaction.inrAmount,id,1]);
        
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
    
   
    const queryText = `INSERT INTO transaction (date, description, amount, currency, inramount)
    VALUES ${transaction.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(',')}
    RETURNING *`;

    const values = transaction.flatMap(item => [item.Date, item.Description, item.Amount, item.Currency, item.inramount]);
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
        const result=await db.query(`UPDATE transaction SET ispresent =${0} WHERE id=${id}`);
        
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

async function batchDelete(ids) {
    try {
        // Create a comma-separated string of IDs
        const idsString = ids.join(',');

        // Perform the batch update query
        const result = await db.query(`UPDATE transaction SET ispresent = 0 WHERE id IN (${idsString})`);

        // Check if any rows were affected
        if (result.rowCount > 0) {
            return { status: "Deleted Successfully" };
        } else {
            throw { status: 400, message: dbError.ids(ids) };
        }
    } catch (error) {
        console.log(dbError.delete, error);
        throw (error.status ? error : { status: 500, message: dbError.delete });
    }
}



export default {batchDelete, getAllTransactions, getTransactionById, addTransaction, updateTransaction, deleteTransaction,addBatchTransaction };