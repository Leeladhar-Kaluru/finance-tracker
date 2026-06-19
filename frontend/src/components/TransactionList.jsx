import { formatCurrency, formatDate } from "../utils/formatters";

function TransactionList({ transactions, isLoading, hasActiveFilters, onEdit, onDelete }) {
    return(
        <section className="panel transaction-panel fade-in-up">
            <div className="panel__header">
                <div>
                    <p className="eyebrow">All transactions</p>
                    <h2>Recent activity</h2>
                </div>
                <p className="panel__copy">Edit or remove entries without leaving the page.</p>
            </div>

            {isLoading ? (
                <div className="transaction-list transaction-list--loading">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <article key={index} className="transaction-skeleton" aria-hidden="true">
                            <div className="skeleton skeleton--title" />
                            <div className="skeleton skeleton--line" />
                            <div className="skeleton skeleton--line" />
                        </article>
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <div className="empty-state">
                    <h3>{hasActiveFilters ? "No matching transactions" : "No transactions yet"}</h3>
                    <p>
                        {hasActiveFilters
                            ? "Try clearing the search, type, or sort filters to bring results back."
                            : "Add your first income or expense to see the dashboard come alive."}
                    </p>
                </div>
            ) : (
                <div className="transaction-list">
                    {transactions.map((transaction, index) => {
                        const isIncome = transaction.transactionType === "income";

                        return (
                            <article
                                key={transaction._id}
                                className="transaction-item"
                                style={{ "--delay": `${index * 75}ms` }}
                            >
                                <div className="transaction-item__main">
                                    <div className="transaction-item__meta">
                                        <span className={`pill ${isIncome ? "pill--income" : "pill--expense"}`}>
                                            {transaction.transactionType}
                                        </span>
                                        <span className="transaction-item__category">{transaction.category}</span>
                                    </div>

                                    <p className="transaction-item__description">{transaction.description}</p>
                                    <p className="transaction-item__date">{formatDate(transaction.date)}</p>
                                </div>

                                <div className="transaction-item__side">
                                    <strong className={isIncome ? "amount amount--income" : "amount amount--expense"}>
                                        {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
                                    </strong>

                                    <div className="transaction-item__actions">
                                        <button type="button" className="button button--ghost button--small" onClick={() => onEdit(transaction)}>
                                            Edit
                                        </button>
                                        <button type="button" className="button button--danger button--small" onClick={() => onDelete(transaction)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    )
}

export default TransactionList;