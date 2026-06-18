import axios from "axios";

const API_URL = 'http://localhost:7000/api/transactions';

export const createTransaction = async (transactionData) => {
    try {
        const response = await axios.post(API_URL, transactionData);
        return response.data;
    } catch (err) {
        console.log("Error creating transaction:", err);
    }
}