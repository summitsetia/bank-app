import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

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
    const response = await axios.post('http://localhost:3000/userData', {}, { withCredentials: true });
    return response.data; 
};

export default createAccountsQuery;