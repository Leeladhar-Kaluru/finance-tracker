const Transaction = require("../models/Transaction");

const createTransaction = async (req,res)=>{
    try{
        // const {amount, transactionType, category, description, date} = req.body;

        const transaction = await Transaction.create(req.body);
        res.status(201).json({
            success:true,
            data:transaction
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

module.exports = {createTransaction};