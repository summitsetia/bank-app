import { Check, Ellipsis, X } from "lucide-react";
import Button from "../../components/Button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAccountsQuery }from "../../api/accounts";
import checkUsername from "../../api/UsernameCheck";
import { createTransaction } from "../../api/transactions";

const TransactionForm = ({ reverseState }: { reverseState: () => void }) => {
    const queryClient = useQueryClient();

    const [transactionData, settransactionData] = useState<{ 
        transactionType: string;
        amount: string;
        fromAccount: string;
        description: string;
        toAccount?: string; 
        title?: string;
        username?: string;
     }>({
        transactionType: "",
        amount: "",
        fromAccount: "",
        description: ""
    });

    const [userFound, setUserFound] = useState(false);

    const { data } = useQuery(createAccountsQuery())

    const { mutate, isPending, isSuccess} = useMutation({
        mutationFn: checkUsername,
        onSuccess: (data) => {
            setUserFound(data.userFound);
        }
    })

    const handleCheckUsername = () => {
        if (transactionData.username) {
            mutate(transactionData.username);
        }
    }

    const { mutate: transactionMutate} = useMutation({
        mutationFn: createTransaction,
        onSuccess: (data) => {
            if (data.isSuccessful === true) {
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                reverseState();
            }
        },
        onError: (error) => {
            console.log("Failed to create account", error);
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {value, name} = e.target;
        settransactionData((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (transactionData.transactionType === "PayToPerson" && !userFound) {
            alert("Cannot submit. Username not found.");
            return; 
        }

        transactionMutate(transactionData)
    }

    const AccountOptions = data?.accountData.map((item) => (
        <option key={item.account_id} value={item.account_id}>
            {item.account_name} - {item.account_type} (${item.balance})
        </option>
    ))

    return (
        <div className="flex flex-col items-center rounded-md bg-white z-50 p-8 absolute shadow-md mt-8 w-[50%] h-[75%]">
            <div className="pb-4 absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700" onClick={reverseState}>
                <X />
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
                <h1 className="font-bold text-3xl">Create New Transaction</h1>
                <div className="flex flex-col items-center gap-2">
                    <label className="">Type Of Transaction</label>
                    <select className="border rounded-2xl p-2" name="transactionType" id="transaction" value={transactionData.transactionType} onChange={handleChange} required>
                        <option value="">--Please choose an option--</option>
                        <option value="Payment">Payment</option>
                        <option value="Transfer">Transfer</option>
                        <option value="PayToPerson">Pay To Person</option>
                    </select>
                </div>
                {transactionData.transactionType && (
                    <div className="flex flex-col items-center gap-2">
                        <label>From Account</label>
                        <select
                            className="border rounded-2xl p-2"
                            name="fromAccount"
                            onChange={handleChange}
                            required
                        >
                            <option value="">--Select From--</option>
                            {AccountOptions}
                        </select>
                    </div>
                )}
                {transactionData.transactionType === "Transfer" && (
                    <>
                        <div className="flex flex-col items-center gap-2">
                            <label>To Account</label>
                            <select
                                className="border rounded-2xl p-2"
                                name="toAccount"
                                onChange={handleChange}
                                required
                            >
                                <option value="">--Select To--</option>
                                {AccountOptions}
                            </select>
                        </div>
                    </>
                )}
                {transactionData.transactionType === "Payment" && (
                    <>
                        <div className="flex flex-col items-center gap-2">
                            <label className="">Title</label>
                            <input
                                className="p-2 rounded border"
                                name="title"
                                placeholder="Name Of Payment"
                                onChange={handleChange}
                                value={transactionData.title}
                                required
                            />
                        </div>
                    </>
                )}
                {transactionData.transactionType === "PayToPerson" && (
                    <>
                        <div className="flex flex-col items-center gap-2">
                            <label className="">Username</label>
                            <div className="relative">
                                <input
                                    className="p-2 rounded border"
                                    name="username"
                                    placeholder="Account Username"
                                    onChange={handleChange}
                                    onBlur={handleCheckUsername}
                                    value={transactionData.username}
                                    required
                                />

                                {isPending && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    <Ellipsis />
                                </div>
                                )}

                                {isSuccess && userFound && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                                        <Check />
                                    </div>
                                )}
                                {isSuccess && !userFound && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600">
                                        <X />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
                <div className="flex flex-col items-center gap-2">
                    <label className="">Amount (In Dollars $)</label> 
                    <input
                        className="p-2 rounded border"
                        placeholder="Amount ($)"
                        name="amount"
                        onChange={handleChange}
                        value={transactionData.amount}
                        type="number"
                        required
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <label className="">Description</label>
                    <input
                        className="p-2 rounded border"
                        name="description"
                        placeholder="Description Of Payment"
                        onChange={handleChange}
                        value={transactionData.description}
                    />
                </div>
                <Button content={"Create Transaction"} />
            </form>
        </div>
    )
}

export default TransactionForm;