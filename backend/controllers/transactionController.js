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

const getTransactions = async (req,res)=>{
    try{
        const transactions = await Transaction.find();
        res.status(201).json({
            success:true,
            data:transactions
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

const getTransactionById = async (req,res)=>{
    try{
        const {id} = req.params;
        const transaction = await Transaction.findById(id);
        if(!transaction){
            return res.status(404).json({
                success:false,
                message:"Transaction not found"
            });
        }
        else{
            res.status(201).json({
                success:true,
                data:transaction
            });
        }
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

const deleteTransaction = async (req,res)=>{
    try{
        const {id} = req.params;
        const transaction = await Transaction.findByIdAndDelete(id);
        if(!transaction){
            return res.status(404).json({
                success:false
            })
        }
        else{
            res.status(201).json({
                success:true,
                message:"Transaction deleted successfully"
            });
        }
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

const updateTransaction = async (req,res)=>{
    try{
        const {id} = req.params;
        const transaction = await Transaction.findByIdAndUpdate(id, req.body, {
            new:true,
            runValidators:true});
        if(!transaction){
            return res.status(404).json({
                success:false,
                message:"Transaction not found"
            });
        }
        else{
            res.status(201).json({
                success:true,
                data:transaction,
                message:"Transaction updated successfully"
            });
        }
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

module.exports = {createTransaction, getTransactions, getTransactionById, deleteTransaction, updateTransaction};