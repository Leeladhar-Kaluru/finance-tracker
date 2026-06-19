const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: [true, "Please add a transaction amount"],
        min: [1, "Amount must be greater than 0"]
    },
    transactionType:{
        type: String,
        enum: ["income", "expense"],
        required: [true, "Please add a transaction type"]
    },
    category:{
        type: String,
        required: [true, "Please add a transaction category"]
    },
    description:{
        type: String,
        required: [true, "Please add a transaction description"],
        trim: true
    },
    date:{
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;