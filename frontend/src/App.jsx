import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  createTransaction,
  deleteTransaction,
  getCategoryExpenses,
  getMonthlyTransactions,
  getSummary,
  getTransactions,
  updateTransaction,
} from "./services/transactionService";
import Navbar from './components/Navbar';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import DashBoard from './components/DashBoard';

const buildPayload = (formData) => ({
  amount: Number(formData.amount),
  transactionType: formData.transactionType,
  category: formData.category.trim(),
  description: formData.description.trim(),
  ...(formData.date ? { date: formData.date } : {}),
});

function App(){
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
    recentTransactions: [],
  });
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setIsLoading(true);
      setError("");

      const [transactionsResult, summaryResult, categoryResult, monthlyResult] =
        await Promise.allSettled([
          getTransactions(),
          getSummary(),
          getCategoryExpenses(),
          getMonthlyTransactions(),
        ]);

      if (ignore) {
        return;
      }

      const loadErrors = [];

      if (transactionsResult.status === "fulfilled") {
        setTransactions(transactionsResult.value);
      } else {
        loadErrors.push("transactions");
      }

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value);
      } else {
        loadErrors.push("summary");
      }

      if (categoryResult.status === "fulfilled") {
        setCategoryExpenses(categoryResult.value);
      } else {
        loadErrors.push("category breakdown");
      }

      if (monthlyResult.status === "fulfilled") {
        setMonthlyTransactions(monthlyResult.value);
      } else {
        loadErrors.push("monthly trend");
      }

      if (loadErrors.length > 0) {
        setError(
          `Some dashboard data could not load: ${loadErrors.join(", ")}. The rest of the app is still available.`
        );
      }

      setIsLoading(false);
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    if (!statusMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage("");
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [statusMessage]);

  const refreshData = () => {
    setReloadToken((value) => value + 1);
  };

  const handleSaveTransaction = async (formData) => {
    setIsSaving(true);
    setError("");

    try {
      const payload = buildPayload(formData);

      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, payload);
        setStatusMessage("Transaction updated successfully.");
      } else {
        await createTransaction(payload);
        setStatusMessage("Transaction added successfully.");
      }

      setEditingTransaction(null);
      refreshData();
    } catch (err) {
      setError(err.message || "Unable to save the transaction right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTransaction = (transaction) => {
    setStatusMessage("");
    setEditingTransaction({
      ...transaction,
      date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : "",
    });
  };

  const handleDeleteTransaction = async (transaction) => {
    const confirmed = window.confirm(
      `Delete ${transaction.category} transaction for ${transaction.amount}?`
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteTransaction(transaction._id);

      if (editingTransaction?._id === transaction._id) {
        setEditingTransaction(null);
      }

      setStatusMessage("Transaction deleted successfully.");
      refreshData();
    } catch (err) {
      setError(err.message || "Unable to delete the transaction right now.");
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesSearch = (transaction) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        transaction.category,
        transaction.description,
        transaction.transactionType,
        String(transaction.amount),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    };

    const matchesType = (transaction) => {
      if (transactionTypeFilter === "all") {
        return true;
      }

      return transaction.transactionType === transactionTypeFilter;
    };

    const sortedTransactions = [...transactions]
      .filter((transaction) => matchesSearch(transaction) && matchesType(transaction))
      .sort((left, right) => {
        if (sortBy === "amount-desc") {
          return Number(right.amount) - Number(left.amount);
        }

        if (sortBy === "amount-asc") {
          return Number(left.amount) - Number(right.amount);
        }

        const leftDate = new Date(left.date || left.createdAt || 0).getTime();
        const rightDate = new Date(right.date || right.createdAt || 0).getTime();

        return sortBy === "date-asc" ? leftDate - rightDate : rightDate - leftDate;
      });

    return sortedTransactions;
  }, [searchTerm, sortBy, transactionTypeFilter, transactions]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() || transactionTypeFilter !== "all" || sortBy !== "date-desc"
  );

  return(
    <div className="app-shell">
      <div className="orb orb--one" aria-hidden="true" />
      <div className="orb orb--two" aria-hidden="true" />
      <Navbar summary={summary} />

      <main className="app-main">
        <section className="hero-panel fade-in-up">
          <div className="hero-panel__content">
            <p className="eyebrow">Personal finance dashboard</p>
            <h2>See where your money goes and fix problems before they grow.</h2>
            <p className="hero-panel__copy">
              A cleaner workflow for tracking income, expenses, categories, and trends.
              Everything below is built to be easier to scan, easier to maintain, and easier to deploy.
            </p>
          </div>

          <div className="hero-panel__highlights">
            <article className="hero-stat">
              <span>Balance</span>
              <strong>{summary.balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong>
            </article>
            <article className="hero-stat">
              <span>Transactions</span>
              <strong>{summary.transactionCount}</strong>
            </article>
            <article className="hero-stat hero-stat--accent">
              <span>Status</span>
              <strong>{summary.balance >= 0 ? "Healthy" : "Needs review"}</strong>
            </article>
          </div>
        </section>

        {(error || statusMessage) && (
          <section className="message-stack" aria-live="polite">
            {error && <div className="notice notice--error">{error}</div>}
            {statusMessage && <div className="notice notice--success">{statusMessage}</div>}
          </section>
        )}

        <DashBoard
          summary={summary}
          categoryExpenses={categoryExpenses}
          monthlyTransactions={monthlyTransactions}
          isLoading={isLoading}
        />

        <section className="panel transaction-toolbar fade-in-up">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Filter bar</p>
              <h2>Search and sort entries</h2>
            </div>
            <p className="panel__copy">Use this to quickly find old expenses or inspect a category trend.</p>
          </div>

          <div className="transaction-toolbar__grid">
            <label className="field">
              <span>Search</span>
              <input
                type="search"
                placeholder="Search category, description, or amount"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Type</span>
              <select value={transactionTypeFilter} onChange={(event) => setTransactionTypeFilter(event.target.value)}>
                <option value="all">All transactions</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label className="field">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Highest amount</option>
                <option value="amount-asc">Lowest amount</option>
              </select>
            </label>

            <div className="transaction-toolbar__count">
              <span>Showing</span>
              <strong>{filteredTransactions.length}</strong>
            </div>
          </div>
        </section>

        <section className="workspace-grid">
          <TransactionForm
            key={editingTransaction?._id || "new-transaction"}
            editingTransaction={editingTransaction}
            onSubmit={handleSaveTransaction}
            onCancelEdit={handleCancelEdit}
            isSubmitting={isSaving}
          />

          <TransactionList
            transactions={filteredTransactions}
            isLoading={isLoading}
            hasActiveFilters={hasActiveFilters}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </section>
      </main>
    </div> 
  )
}

export default App;