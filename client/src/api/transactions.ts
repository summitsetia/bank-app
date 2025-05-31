import { queryOptions } from "@tanstack/react-query";
import client from "./axiosClient";

type BaseTransaction = {
    transaction_type: string;
    amount: string;
    from_account_id: string;
    description: string;
    created_at: string;
}

type PaymentTransaction = BaseTransaction & {
  transaction_type: "Payment";
  payee: string;
};

type TransferTransaction = BaseTransaction & {
  transaction_type: "Transfer";
  to_account_id: string; 
};

type PayToPersonTransaction = BaseTransaction & {
  transaction_type: "PayToPerson";
  username: string;
};

type IncomeTransaction = BaseTransaction & {
    income_id: string;
    user_id: string;
    transaction_id: string;
}

type Transaction = PaymentTransaction | TransferTransaction | PayToPersonTransaction | IncomeTransaction;

interface NewTransactionData {
    transactionType: string;
    amount: string;
    fromAccount: string;
    description: string;
    toAccount?: string; 
    title?: string;
    username?: string;
}


function createTransactionQuery() {
    return queryOptions({
        queryKey: ['transactions'],
        queryFn: fetchTransactionData
    })
}

const fetchTransactionData = async (): Promise<{ allData: Transaction[]}> => {
    const response = await client.get('/transactionData');
    return response.data; 
};

const createTransaction = async (transactionData: NewTransactionData) => {
    const response = await client.post('/transactions', transactionData);
    return response.data;
}


export {createTransactionQuery, createTransaction};