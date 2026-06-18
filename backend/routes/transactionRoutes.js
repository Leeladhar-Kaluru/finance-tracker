const express = require("express");
const {
        createTransaction, getTransactions, getTransactionById,
        deleteTransaction, updateTransaction, getTransactionSummary
    } = require("../controllers/transactionController");
const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/summary", getTransactionSummary);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);


module.exports = router;