import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
const app = express();
import router from "./routes/routes.js";

import cors from "cors";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database:process.env.DATABASE,
    password: process.env.PASSWORD,
    port:5432
})
db.connect();

const port = 8080;
app.use(cors());
app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Server started on PORT ${port}`);
})

app.use("/transaction", router);


export default db;



