import { formatCurrency } from "../utils/formatters";

const formatValue = (value, format) => {
    if (format === "number") {
        return new Intl.NumberFormat("en-US").format(Number(value || 0));
    }

    if (format === "currency") {
        return formatCurrency(value);
    }

    return value;
};

const SummaryCards = ({ title, value, hint, tone = "neutral", isLoading = false, format = "text" }) => {
    return ( 
        <article className={`summary-card summary-card--${tone} ${isLoading ? "summary-card--loading" : ""}`}>
            <span className="summary-card__title">{title}</span>
            <strong className="summary-card__value">
                {isLoading ? "Loading..." : formatValue(value, format)}
            </strong>
            <span className="summary-card__hint">{hint}</span>
        </article>
     );
}
 
export default SummaryCards;