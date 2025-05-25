import { X } from "lucide-react";
import Button from "../../components/Button";
import { useState } from "react";

const TransactionForm = ({ reverseState }: { reverseState: () => void }) => {

    const [transactionData, settransactionData] = useState<{ transactionType: string; amount: string }>({
        transactionType: "",
        amount: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {value, name} = e.target;
        settransactionData((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("Success")
    }

    return (
        <div className="flex flex-col items-center rounded-md bg-white z-50 p-8 absolute shadow-md mt-8 w-[50%] h-[75%]">
            <div className="pb-4 absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700" onClick={reverseState}>
                <X />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
                <h1 className="font-bold text-3xl">Create New Transaction</h1>
                <div className="flex flex-col items-center gap-2">
                    <label className="">Type Of Transaction</label>
                    <select className="border rounded-2xl p-2" name="accountType" id="account" value={transactionData.transactionType} onChange={handleChange} required>
                        <option value="">--Please choose an option--</option>
                        <option value="Jumpstart">Payment</option>
                        <option value="Savings">Transfer</option>
                        <option value="Term Deposit">Pay To Person</option>
                    </select>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="">Amount (In Dollars $)</label>
                    <input className="p-2 rounded border" placeholder="Balance ($)" name="balance" onChange={handleChange} value={transactionData.amount} type="number" />
                </div>
                <Button content={"Create Transaction"} />
            </form>
        </div>
    )
}

export default TransactionForm;