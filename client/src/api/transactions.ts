import { queryOptions } from "@tanstack/react-query";
import client from "./axiosClient";

interface TransactionData {
    transaction_type: string;
    amount: string;
    from_account_id: string;
    description: string;
    to_account_id?: string; 
    title?: string;
    username?: string;
    created_at: string;
}

interface NewTransactionData {
    transactionType: string;
    amount: string;
    fromAccount: string;
    description: string;
    toAccount?: string; 
    title?: string;
    username?: string;
}

interface IncomeData {
    income_id: string;
    user_id: string;
    transaction_id: string;
    amount: string;
    created_at: string;
}


function createTransactionQuery() {
    return queryOptions({
        queryKey: ['transactions'],
        queryFn: fetchTransactionData
    })
}

const fetchTransactionData = async (): Promise<{ data: TransactionData[], incomeData: IncomeData[]}> => {
    const response = await client.get('/transactionData');
    return response.data; 
};

const createTransaction = async (transactionData: NewTransactionData) => {
    const response = await client.post('/transactions', transactionData);
    return response.data;
}


export {createTransactionQuery, createTransaction};