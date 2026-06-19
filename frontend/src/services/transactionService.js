const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api/transactions';

const request = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options,
    });

    let payload;
    try {
        const responseText = await response.text();
        payload = responseText ? JSON.parse(responseText) : null;
    } catch {
        payload = null;
    }

    if (!response.ok) {
        throw new Error(payload?.message || `Request failed with status ${response.status}`);
    }

    return payload;
};

export const createTransaction = async (transactionData) => {
    return request(API_URL, {
        method: 'POST',
        body: JSON.stringify(transactionData),
    });
};

export const getTransactions = async ()=>{
    const response = await request(API_URL);
    return response.data;
};

export const getSummary = async ()=>{
    const response = await request(`${API_URL}/summary`);
    return response.data;
};

export const getCategoryExpenses = async () => {
    const response = await request(`${API_URL}/category-expense`);
    return response.data;
};

export const getMonthlyTransactions = async () => {
    const response = await request(`${API_URL}/monthly-transactions`);
    return response.data;
};

export const updateTransaction = async (id, transactionData) => {
    const response = await request(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData),
    });

    return response.data;
};

export const deleteTransaction = async (id) => {
    const response = await request(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    return response;
};