import { useState } from "react";

function TransactionForm({ editingTransaction, onSubmit, onCancelEdit, isSubmitting }){
    const [formData, setFormData] = useState(() => ({
        amount: editingTransaction?.amount ?? "",
        transactionType: editingTransaction?.transactionType ?? "income",
        category: editingTransaction?.category ?? "",
        description: editingTransaction?.description ?? "",
        date: editingTransaction?.date ? editingTransaction.date.slice(0, 10) : "",
    }));

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        await onSubmit(formData);
    }

    return(
        <section className="panel form-panel fade-in-up">
            <div className="panel__header">
                <div>
                    <p className="eyebrow">Transaction editor</p>
                    <h2>{editingTransaction ? "Edit transaction" : "Add transaction"}</h2>
                </div>
                <p className="panel__copy">
                    Keep categories short and consistent. That makes the dashboard easier to read later.
                </p>
            </div>

            <form className="transaction-form" onSubmit = {handleSubmit}>
                <label>
                    <span>Amount</span>
                    <input
                        type="number"
                        name="amount"
                        placeholder="1250"
                        min="0.01"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    <span>Type</span>
                    <select name="transactionType" value={formData.transactionType} onChange={handleChange}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </label>

                <label>
                    <span>Category</span>
                    <input
                        type="text"
                        name="category"
                        placeholder="Salary, Groceries, Rent"
                        required
                        value={formData.category}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    <span>Description</span>
                    <input
                        type="text"
                        name="description"
                        placeholder="Short note about the transaction"
                        required
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    <span>Date</span>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </label>

                <div className="transaction-form__actions">
                    <button type="submit" className="button button--primary" disabled={isSubmitting}>
                        {isSubmitting
                            ? "Saving..."
                            : editingTransaction
                                ? "Update transaction"
                                : "Save transaction"}
                    </button>

                    {editingTransaction && (
                        <button type="button" className="button button--ghost" onClick={onCancelEdit}>
                            Cancel edit
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default TransactionForm;