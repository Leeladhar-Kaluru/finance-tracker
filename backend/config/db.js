const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully");
    }
    catch(err){
        console.log("database connection error:"+ err.message);
        process.exit(1);
    }
};

module.exports = connectDB;