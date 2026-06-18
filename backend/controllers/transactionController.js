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

const getTransactionSummary = async (req,res)=>{
    try{
        const income = await Transaction.aggregate([
            {$match: {transactionType: "income"}},
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        const expense = await Transaction.aggregate([
            {$match: {transactionType: "expense"}},
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);
        
        const recentTransactions = await Transaction.find().sort({date: -1}).limit(5);

        const totalIncome = income.length>0 ? income[0].total :0;
        const totalExpense = expense.length>0 ? expense[0].total : 0;
        const balance = totalIncome - totalExpense;

        res.status(201).json({
            success:true,
            data:{
                totalIncome,
                totalExpense,
                balance,
                recentTransactions
            }
        }); 
    }

    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }

}

const getCategoryExpense = async (req,res)=>{
    try{
        const categoryExpense = await Transaction.aggregate([
            {$match: {transactionType: "expense"}},
            {$group: {_id: "$category", total: {$sum: "$amount"}}},
            {$sort: {total: -1}},
            {$project: {_id:0, category: "$id", total: 1}}
        ])
        res.status(201).json({
            success:true,
            data:categoryExpense
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

const getMonthlyTransaction = async (req, res)=>{
    try{
        const monthlyTransaction = await Transaction.aggregate([
            {$group: {
                _id: {month: {$month: "$date"}},
                income: {$sum: {$cond: [{$eq: ["$transactionType", "income"]}, "$amount", 0]}},
                expense: {$sum: {$cond: [{$eq: ["$transactionType", "expense"]}, "$amount", 0]}}
            }},
            {
            $project: {
                _id: 0,
                month: "$_id.month",
                income:1,
                expense:1
            }
        },
            {$sort: {month: 1}}
        ]);
        res.status(201).json({
            success:true,
            data:monthlyTransaction
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};



module.exports = {createTransaction, getTransactions, getTransactionById, deleteTransaction, updateTransaction, 
getTransactionSummary, getCategoryExpense, getMonthlyTransaction};