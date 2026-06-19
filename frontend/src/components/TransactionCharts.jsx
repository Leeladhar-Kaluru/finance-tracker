import { useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import { formatMonthLabel } from "../utils/formatters";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

function TransactionCharts({ categoryExpenses, monthlyTransactions, isLoading }) {
    const categoryChartData = useMemo(() => ({
        labels: categoryExpenses.map((item) => item.category),
        datasets: [
            {
                label: "Expense by category",
                data: categoryExpenses.map((item) => item.total),
                backgroundColor: ["#38bdf8", "#22c55e", "#f59e0b", "#fb7185", "#c084fc", "#f97316"],
                borderWidth: 0,
                hoverOffset: 8,
            },
        ],
    }), [categoryExpenses]);

    const monthlyChartData = useMemo(() => ({
        labels: monthlyTransactions.map((item) => formatMonthLabel(item.year, item.month)),
        datasets: [
            {
                label: "Income",
                data: monthlyTransactions.map((item) => item.income),
                backgroundColor: "rgba(34, 197, 94, 0.85)",
                borderRadius: 10,
            },
            {
                label: "Expense",
                data: monthlyTransactions.map((item) => item.expense),
                backgroundColor: "rgba(251, 113, 133, 0.85)",
                borderRadius: 10,
            },
        ],
    }), [monthlyTransactions]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#cbd5e1",
                    boxWidth: 12,
                    boxHeight: 12,
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: "rgba(2, 6, 23, 0.95)",
                titleColor: "#f8fafc",
                bodyColor: "#e2e8f0",
                borderColor: "rgba(148, 163, 184, 0.2)",
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: { color: "#cbd5e1" },
                grid: { color: "rgba(148, 163, 184, 0.08)" },
            },
            y: {
                ticks: { color: "#cbd5e1" },
                grid: { color: "rgba(148, 163, 184, 0.08)" },
            },
        },
    };

    return (
        <section className="chart-grid fade-in-up">
            <article className="chart-card">
                <div className="chart-card__header">
                    <div>
                        <p className="eyebrow">Charts</p>
                        <h3>Expense mix</h3>
                    </div>
                    <span>Real chart library</span>
                </div>

                <div className="chart-card__body chart-card__body--doughnut">
                    {isLoading ? (
                        <div className="empty-inline">Loading chart...</div>
                    ) : categoryExpenses.length > 0 ? (
                        <Doughnut
                            data={categoryChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                        labels: {
                                            color: "#cbd5e1",
                                            boxWidth: 12,
                                            boxHeight: 12,
                                            usePointStyle: true,
                                        },
                                    },
                                },
                            }}
                        />
                    ) : (
                        <div className="empty-inline">No expense data yet.</div>
                    )}
                </div>
            </article>

            <article className="chart-card chart-card--wide">
                <div className="chart-card__header">
                    <div>
                        <p className="eyebrow">Charts</p>
                        <h3>Monthly cash flow</h3>
                    </div>
                    <span>Income vs expense</span>
                </div>

                <div className="chart-card__body chart-card__body--bar">
                    {isLoading ? (
                        <div className="empty-inline">Loading chart...</div>
                    ) : monthlyTransactions.length > 0 ? (
                        <Bar data={monthlyChartData} options={chartOptions} />
                    ) : (
                        <div className="empty-inline">No monthly trend data yet.</div>
                    )}
                </div>
            </article>
        </section>
    );
}

export default TransactionCharts;