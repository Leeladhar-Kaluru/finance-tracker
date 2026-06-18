import { useState } from "react";
import { createTransaction } from "../services/transactionService";

function TransactionForm({ fetchTransactions }){
    const [formData, setFormData] = useState({
        amount: '',
        transactionType: 'income',
        category: '',
        description: '',
        date: ''
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const data = await createTransaction(formData);

            await fetchTransactions();
            
            setFormData({
                amount: '',
                transactionType: 'income',
                category: '',
                description: '',
                date: ''
            })
        }
        catch(err){
            console.log("Error creating transaction:", err);
        };
    }

    return(
        <div>
            <h2>Add Transaction</h2>
            <form className="transaction-form" onSubmit = {handleSubmit}>
                <input type="number" name="amount" placeholder="Amount" value={formData.amount}
                onChange={(event)=> handleChange(event)} />

                <select name="transactionType" value={formData.transactionType} 
                onChange={(event)=> handleChange(event)}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <input type="text" name="category" placeholder="Category" value={formData.category}
                onChange={(event)=> handleChange(event)} />

                <input type="text" name="description" placeholder="Description" value={formData.description}
                onChange={(event)=> handleChange(event)} />

                <input type="date" name="date" value={formData.date}
                onChange={(event)=> handleChange(event)} />

                <button type="submit">Add Transaction</button>
            </form>
        </div>
    );
}

export default TransactionForm;