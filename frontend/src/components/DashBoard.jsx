import SummaryCards from './SummaryCards';
import { formatCurrency, formatMonthLabel } from "../utils/formatters";
import TransactionCharts from './TransactionCharts';

function DashBoard({ summary, categoryExpenses, monthlyTransactions, isLoading }){
    const maxCategoryExpense = categoryExpenses[0]?.total || 0;
    const maxMonthlyValue = monthlyTransactions.reduce((maxValue, item) => {
        return Math.max(maxValue, item.income || 0, item.expense || 0);
    }, 0);

    return (
        <section className="dashboard-panel fade-in-up">
            <div className="panel__header">
                <div>
                    <p className="eyebrow">Dashboard</p>
                    <h2>Numbers at a glance</h2>
                </div>
                <p className="panel__copy">The goal is faster decisions, not more clutter.</p>
            </div>

            <div className="summary-grid">
                <SummaryCards
                    title="Total income"
                    value={summary.totalIncome}
                    tone="income"
                    isLoading={isLoading}
                    hint="Money coming in"
                    format="currency"
                />
                <SummaryCards
                    title="Total expense"
                    value={summary.totalExpense}
                    tone="expense"
                    isLoading={isLoading}
                    hint="Money going out"
                    format="currency"
                />
                <SummaryCards
                    title="Balance"
                    value={summary.balance}
                    tone={summary.balance >= 0 ? "positive" : "negative"}
                    isLoading={isLoading}
                    hint={summary.balance >= 0 ? "You are in the green" : "Spend less than you earn"}
                    format="currency"
                />
                <SummaryCards
                    title="Transactions"
                    value={summary.transactionCount}
                    tone="neutral"
                    isLoading={isLoading}
                    hint="Total entries tracked"
                    format="number"
                />
            </div>

            <TransactionCharts
                categoryExpenses={categoryExpenses}
                monthlyTransactions={monthlyTransactions}
                isLoading={isLoading}
            />

            <div className="insight-grid">
                <article className="insight-card">
                    <div className="insight-card__header">
                        <h3>Recent activity</h3>
                        <span>{summary.recentTransactions.length} entries</span>
                    </div>

                    <div className="mini-list">
                        {summary.recentTransactions.length > 0 ? summary.recentTransactions.map((transaction) => (
                            <div key={transaction._id} className="mini-list__item">
                                <div>
                                    <strong>{transaction.category}</strong>
                                    <p>{transaction.description}</p>
                                </div>
                                <span className={transaction.transactionType === "income" ? "amount amount--income" : "amount amount--expense"}>
                                    {transaction.transactionType === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                                </span>
                            </div>
                        )) : (
                            <p className="empty-inline">Recent activity will show up here after your first few entries.</p>
                        )}
                    </div>
                </article>

                <article className="insight-card">
                    <div className="insight-card__header">
                        <h3>Spending by category</h3>
                        <span>{categoryExpenses.length} categories</span>
                    </div>

                    <div className="bar-list">
                        {categoryExpenses.length > 0 ? categoryExpenses.map((item) => (
                            <div key={item.category} className="bar-list__item">
                                <div className="bar-list__label-row">
                                    <span>{item.category}</span>
                                    <strong>{formatCurrency(item.total)}</strong>
                                </div>
                                <div className="bar-list__track" aria-hidden="true">
                                    <div
                                        className="bar-list__fill"
                                        style={{ width: `${maxCategoryExpense > 0 ? Math.max(12, (item.total / maxCategoryExpense) * 100) : 0}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="empty-inline">Expense categories will appear once you start logging spending.</p>
                        )}
                    </div>
                </article>

                <article className="insight-card insight-card--wide">
                    <div className="insight-card__header">
                        <h3>Monthly trend</h3>
                        <span>Income vs expense</span>
                    </div>

                    <div className="trend-list">
                        {monthlyTransactions.length > 0 ? monthlyTransactions.map((item) => (
                            <div key={`${item.year}-${item.month}`} className="trend-list__item">
                                <div className="trend-list__label">{formatMonthLabel(item.year, item.month)}</div>
                                <div className="trend-list__bars">
                                    <div className="trend-bar">
                                        <span>Income</span>
                                        <div className="trend-bar__track"><div className="trend-bar__fill trend-bar__fill--income" style={{ width: `${maxMonthlyValue > 0 ? Math.max(10, (item.income || 0) / maxMonthlyValue * 100) : 0}%` }} /></div>
                                    </div>
                                    <div className="trend-bar">
                                        <span>Expense</span>
                                        <div className="trend-bar__track"><div className="trend-bar__fill trend-bar__fill--expense" style={{ width: `${maxMonthlyValue > 0 ? Math.max(10, (item.expense || 0) / maxMonthlyValue * 100) : 0}%` }} /></div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="empty-inline">Monthly totals will appear after there is enough history to compare.</p>
                        )}
                    </div>
                </article>
            </div>
        </section>
    )
}

export default DashBoard;