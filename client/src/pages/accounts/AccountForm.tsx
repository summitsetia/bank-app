import { X } from "lucide-react";
import { useState } from "react";
import Button from "../../components/Button";
import { useQueryClient } from '@tanstack/react-query';
import client from "../api/axiosClient";

const AccountForm = ({ reverseState }: { reverseState: () => void }) => {
    const queryClient = useQueryClient();

    const [accountData, setAccountData] = useState<{ accountType: string; balance: string }>({
        accountType: "",
        balance: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {value, name} = e.target;
        setAccountData((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const accountResult = await client.post('/accountData', accountData)
            console.log(accountResult.data.message)
            const isSuccessfull = accountResult.data.isSuccessfull
            if ( isSuccessfull === true) {
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                reverseState();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col items-center rounded-md bg-white z-50 p-8 absolute shadow-md mt-8 w-[50%] h-[75%]">
            <div className="pb-4 absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700" onClick={reverseState}>
                <X />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
                <h1 className="font-bold text-3xl">Opening A New Account</h1>
                <div className="flex flex-col items-center gap-2">
                    <label className="">Account Type</label>
                    <select className="border rounded-2xl p-2" name="accountType" id="account" value={accountData.accountType} onChange={handleChange} required>
                        <option value="">--Please choose an option--</option>
                        <option value="Jumpstart">Jumpstart</option>
                        <option value="Savings">Savings</option>
                        <option value="Term Deposit">Term Deposit</option>
                    </select>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="">Balance (In Dollars $)</label>
                    <input className="p-2 rounded border" placeholder="Balance ($)" name="balance" onChange={handleChange} value={accountData.balance} type="number" />
                </div>
                <Button content={"Open New Account"} />
            </form>
        </div>
    )
}

export default AccountForm;