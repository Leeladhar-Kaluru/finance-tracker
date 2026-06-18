const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require("cors");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

dotenv.config();

connectDB();

const PORT = 7000;

app.get('/', (req,res)=>{
    res.send("hello world");
});

app.listen(PORT, ()=>{
    console.log("server is running on port " + PORT);
    console.log("http://localhost:" + PORT);
});