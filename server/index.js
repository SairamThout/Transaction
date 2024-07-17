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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const options = {
    method: 'GET',
    url: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/latest',
    params: {
      from: 'USD',
      to: 'EUR,GBP'
    },
    headers: {
      'x-rapidapi-key': 'ce6daa6842mshc71692410912565p141d26jsn61631bdcde73',
      'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
    }
  };





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
    let trans = (await db.query("select* from transaction order by id desc")).rows;
   
    res.send(trans);
    
})

app.get('/get_by_id/:id', async (req, res) => {  //get the row given its id
    const id = req.params.id;
    
    let result = [];
  
    try {
        // Replace this with your actual database query
        result = await db.query(`select * from transaction where id=${id}`);
        
        res.send(result.rows[0]); // Send back the rows retrieved from the database
    } catch (err) {
        console.error("Error retrieving transaction:", err);
        res.status(500).send("Error retrieving transaction"); // Handle the error appropriately
    }
});










 

app.post("/add", async (req, res) => {   //add a single transaction
    
    
    const { amount, description, date, currency } = req.body;
    
    let done = "not done";
    if (isValidAmount(amount) && isValidDate(date) && isValidDescription(description)) {
        
       

        
        
       

        try {
            
            // const response = await axios.request(options);
           
            // let inr_amount = (response.data.rates['INR'] / response.data.rates[currency]) * amount;
            let inr_amount = 100;
            try {
                await db.query("Insert into transaction (date,description,amount,currency,inr_amount) Values($1,$2,$3,$4,$5)", [date, description, amount, currency,inr_amount]);
                done = "Successful";
            }
            catch (err) {
                done = "OOPS!!";
            }
        }
        catch(err) {
            console.log("api ne hug diya");
        }

        
    }
    else if (!isValidDescription(description)) done = "Description cant be empty";
    else if (!isValidDate(date)) done = "Invalid Date";
    else {
        done = "Invalid Amount";
    }
    res.send(done); 
    
})




app.put('/update/:id',async (req, res) => {    //update a row based on its id
    
    const { amount, description, date, currency } = req.body;
    const id = req.params.id;
    let done = "Invalid Details";
   
    if (isValidAmount(amount) && isValidDate(date) && isValidDescription(description)) {

    
        try {
            
            // const response = await axios.request(options);
           
            // let inr_amount = (response.data.rates['INR'] / response.data.rates[currency]) * amount;
            let inr_amount = 100;
            
            try {
                await db.query(`UPDATE transaction SET date = $1, description = $2, amount = $3, currency = $4, inr_amount = $5 WHERE id = $6`,[date, description, amount, currency, inr_amount, id]);
                done = "Edit Successful";
            }
            catch (err) {
                done = "OOPS!!";
            }
        }
        catch(err) {
            console.log("api ne hug diya");
        }

        
    }
    else if (!isValidDescription(description)) done = "Description cant be empty";
    else if (!isValidDate(date)) done = "Invalid Date";
    else {
        done = "Invalid Amount";
    }
    res.send(done); 

       
    
})









app.delete('/del',async (req, res) => {   //del a row based on its id
    const id = req.query.id;
    try {
        await db.query(`Delete from transaction where id=${id}`)
    }
    catch (err) {
        console.log("data not deleted ");
    }
    res.send("done");
    
});






  
app.listen(8080, () => {
    console.log(`Server listening on 8080`);
});



