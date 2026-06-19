const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
});

export const formatCurrency = (value) => moneyFormatter.format(Number(value || 0));

export const formatDate = (value) => {
    if (!value) {
        return "Date not set";
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const formatMonthLabel = (year, month) => {
    const parsedDate = new Date(year, month - 1, 1);
    return monthFormatter.format(parsedDate);
};