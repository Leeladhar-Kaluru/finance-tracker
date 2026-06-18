import { getTransactions } from '../services/transactionService';

function TransactionList({ transactions}) {
    
    return(
        <div>
            <h2>Transaction List</h2>
            {transactions.length === 0 ? (<p>No transactions found.</p>) : 
            (
                transactions.map((transaction)=> (
                    <div key={transaction._id} className="transaction-item">
                        <p>Amount : {transaction.amount}</p>
                        <p>Type : {transaction.transactionType}</p>
                        <p>Category : {transaction.category}</p>
                        <p>Description : {transaction.description}</p>
                        <p>Date : {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    )
}

export default TransactionList;