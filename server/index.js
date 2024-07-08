import express from "express"
const app = express();
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});
  
app.listen(3000, () => {
    console.log(`Server listening on 3000`);
});
