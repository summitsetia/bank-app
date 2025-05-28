import { queryOptions } from "@tanstack/react-query";
import client from "./axiosClient";

interface AccountData {
    account_type: string;
    balance: string;
    account_name: string;
    created_at: string;
}

interface NewAccountData {
  accountType: string;
  balance: string;
  accountName: string;
}

interface UserData {
    email: string;
    first_name: string;
    last_name: string;
}

function createAccountsQuery() {
    return queryOptions({
        queryKey: ['accounts'],
        queryFn: fetchUserData
    })
}

const fetchUserData = async (): Promise<{ userData: UserData; accountData: AccountData[] }> => {
    const response = await client.get('/userData');
    return response.data; 
};

const createAccount = async (accountData: NewAccountData) => {
    const response = await client.post('/accounts', accountData);
    return response.data;
}


export {createAccountsQuery, createAccount};