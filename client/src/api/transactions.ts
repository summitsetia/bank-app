import { queryOptions } from "@tanstack/react-query";
import client from "./axiosClient";

// interface transactionData {
//     account_type: string;
//     balance: string;
//     created_at: string;
// }

// interface NewTransactionData {
//   accountType: string;
//   balance: string;
// }


// function createTransactionQuery() {
//     return queryOptions({
//         queryKey: ['transactions'],
//         queryFn: fetchTransactionData
//     })
// }

// const fetchTransactionData = async (): Promise<{ transactionData: TransactionData[] }> => {
//     const response = await client.get('/transactionData');
//     return response.data; 
// };

const createTransaction = async (transactionData: NewTransactionData) => {
    const response = await client.post('/transactions', transactionData);
    return response.data;
}


export {createTransaction};