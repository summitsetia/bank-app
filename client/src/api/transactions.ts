import { queryOptions } from "@tanstack/react-query";
import client from "./axiosClient";

interface AccountData {
    account_type: string;
    balance: string;
    created_at: string;
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


export default createAccountsQuery;