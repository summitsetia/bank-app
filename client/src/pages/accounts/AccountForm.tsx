import { X } from "lucide-react";
import { useState } from "react";
import Button from "../../components/Button";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAccount } from "../../api/accounts";

const AccountForm = ({ reverseState }: { reverseState: () => void }) => {
    const queryClient = useQueryClient();

    const [accountData, setAccountData] = useState<{ accountType: string; balance: string, accountName: string; }>({
        accountType: "",
        balance: "",
        accountName: ""
    });

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onSuccess: (data) => {
            if (data.isSuccessful === true) {
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
                reverseState();
            }
        },
        onError: (error) => {
            console.log("Failed to create account", error);
        }
    })

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
        mutate(accountData);
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
                    <input className="p-2 rounded border" placeholder="Balance ($)" name="balance" onChange={handleChange} value={accountData.balance} type="number" required/>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="">Account Name</label>
                    <input className="p-2 rounded border" placeholder="Name Of Account" name="accountName" onChange={handleChange} value={accountData.accountName} required/>
                </div>
                <Button content={"Open New Account"} />
            </form>
        </div>
    )
}

export default AccountForm;