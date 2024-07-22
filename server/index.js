import express from "express"
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database:'transaction',
    password: 'Arya@9461',
    port:5432
})
db.connect();
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));



function get_config (date) {
    return {
        method: 'GET',
        url: `https://currency-conversion-and-exchange-rates.p.rapidapi.com/${date}`,
        params: {
            from: 'USD',
            to: 'INR'
        },
        headers: {
            'x-rapidapi-key': '58a0d8150fmshfb8beac6935f4e1p1c15f9jsnfcb684fce61e',
            'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
        }
    }
}


function isValidDescription(description) {
    return description.trim() !== '';
}   
function isValidAmount(amount) {
    let parsedAmount = parseFloat(amount);
    return !isNaN(parsedAmount) && parsedAmount > 0;
}
function isValidDate(dateStr) {
    // Extract date string from the object

    
    // Check if dateStr is not empty
    if (dateStr.trim() !== '') {
      // Convert date string to a Date object
      let date = new Date(dateStr);
  
      // Get current date
      let currentDate = new Date();
  
      // Compare dates
      if (date <= currentDate) {
        return true; // Date is valid (less than or equal to current date)
      } else {
        return false; // Date is invalid (greater than current date)
      }
    } else {
      return false; // Date is empty
    }
}







app.get("/getdata",async (req, res) => { //get all data present in database
    
    try {
        let trans = (await db.query("select* from transaction order by id desc")).rows;

        res.status(200).send(trans);
    }
    catch {
        res.status(500).send("Error while retreiving data from database");
    } 
    
})


app.get('/get_by_id/:id', async (req, res) => {  //get the row given its id
    const id = req.params.id;
    
    let result = [];
  
    try {

        result = await db.query(`select * from transaction where id=${id}`);
        return res.send(result.rows[0]);
        
    } catch (err) {

        console.error("Error retrieving transaction:", err);
        res.status(500).send("Error retrieving transaction"); 

    }
});




const BATCH_SIZE = 500; // Define a suitable batch size

app.post("/add", async (req, res) => {
    let data = req.body;

    // Validate first
    let currency_data;

    try {
        const result = (await axios.get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json")).data;
        currency_data = result.inr;
    } catch (error) {
        console.log("Api is not working", error);
        return res.status(500).send("We are facing some error while fetching currency data");
    }

    // Validation and conversion
    for (let obj of data) {
        if (!isValidDescription(obj.description)) {
            return res.status(400).send("Invalid Description");
        }
        if (!isValidAmount(obj.amount)) {
            return res.status(400).send("Amount should be positive");
        }
        if (!isValidDate(obj.date)) {
            return res.status(400).send("Invalid Date");
        }

        obj.inr_amount = (obj.amount / (currency_data[obj.currency.toLowerCase()] ? currency_data[obj.currency.toLowerCase()] : 1)).toFixed(2);
    }

    // Prepare values for insertion
    const insertValues = data.map((item) => [
        item.date,
        item.description,
        item.amount,
        item.currency,
        item.inr_amount,
    ]);

    try {
        let allResponses = [];

        for (let i = 0; i < insertValues.length; i += BATCH_SIZE) {
            const batch = insertValues.slice(i, i + BATCH_SIZE);
            const values = batch.flat();
            const query = `
                INSERT INTO transaction (date, description, amount, currency, inr_amount)
                VALUES ${batch.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(',')}
                RETURNING *
            `;
            const response = await db.query(query, values);
            allResponses.push(...response.rows);
           
        }

        return res.status(200).send(allResponses.reverse());
    } catch (error) {
        console.log("Error while inserting data into database", error);
        return res.status(500).send("We are facing some error while inserting your data");
    }
});









app.put('/update/:id',async (req, res) => {    //update a row based on its id
    
    
    let obj = req.body;
    obj.id = req.params.id;
   

    //validating the details first

    if (!isValidAmount(obj.amount)) {
        return res.status(400).send("Amount should be positive");
    }
    if (!isValidDate(obj.date)) {
        return res.status(400).send("Invalid Date"); 
    }
    if (!isValidDescription(obj.description)) {
        return res.status(400).send("Description cant be empty");
    }
   
    

    
    try {
        
        //update the inr_amount based on the date provided
        
        let modified_option = options;
        modified_option.params.date = obj.date;
        const response = (await axios.request(get_config(obj.date))).data;
        obj.inr_amount = ((response.rates["INR"] / response.rates[obj.currency]) * obj.amount).toFixed(2);
        
        try {
            await db.query(`UPDATE transaction SET date = $1, description = $2, amount = $3, currency = $4, inr_amount = $5 WHERE id = $6`,[obj.date,obj.description,obj.amount,obj.currency,obj.inr_amount,obj.id]);
            return res.status(200).send(obj);
        }
        catch (err) {
            console.log("Error while updating data into database", err);
            return res.status(500).send("Error while updating data into database");
        }

    }
    catch (err) {
        console.log("Api is not working", err);
        return res.status(500).send("Api limit exceded");
    }

     
   

    
})









app.delete('/del',async (req, res) => {   //del a row based on its id
    const id = req.query.id;
    
    try {
        await db.query(`Delete from transaction where id=${id}`);
        res.status(200).send("Deleted Successfuly");
    }
    catch (err) {
        console.error("Error while deleting data from database", err);
        return res.status(500).send("We cant find the data to delete");
    }
    
});






  
app.listen(8080, () => {
    console.log(`Server listening on 8080`);
});



