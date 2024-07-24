import express from "express";
import bodyParser from "body-parser";
const app = express();
import router from "./routes/routes.js";

import cors from "cors";


const port = 8080;
app.use(cors());
app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Server started on PORT ${port}`);
})

app.use("/transaction", router);






