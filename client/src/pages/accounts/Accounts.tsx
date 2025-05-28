import { useState, type JSX } from "react"
import AccountForm from "./AccountForm"
import { useQuery } from "@tanstack/react-query"
import { BadgeDollarSign, PiggyBank, Vault } from "lucide-react"
import { createAccountsQuery } from "../../api/accounts"

const Accounts = () => {
    const accountIcons: { [key: string]: JSX.Element } = {
        "Jumpstart": <BadgeDollarSign />,
        "Savings": <PiggyBank />,
        "Term Deposit": <Vault />
    }

    const [isShown, setIsShown] = useState<boolean>(false);

    const { data } = useQuery(createAccountsQuery())

    const reverseState = () => {
        setIsShown((prevValue) => !prevValue)
    }

    return (
        <div className="flex flex-col h-screen w-full max-w-screen-xl mx-auto">
            <div className="flex justify-center p-4">
                <button onClick={reverseState}>Open New Account</button> 
            </div>
            
            <div className="flex justify-center mt-[1vh]">
                {isShown && <AccountForm reverseState={reverseState} />}
            </div>
            <div className='flex justify-evenly pt-4 w-full'>
            {data?.accountData.map((account) => (
              <div className='flex flex-col items-center bg-white rounded-2xl shadow-md p-6'>
                <div className='mb-2 text-blue-600'>
                  {accountIcons[account.account_type] || null}
                </div>
                <h2 className='text-2xl font-bold text-gray-800'>{account.account_name}</h2>
                <h1 className='text-lg font-semibold text-gray-800'>{account.account_type}</h1>
                <h1 className='text-xl font-bold text-gray-900'>${account.balance}</h1>
                <p className='text-xs text-gray-500 mt-2'>Opened: {new Date(account.created_at).toDateString()}</p>
              </div>
            ))}
          </div>
        </div>
    )
}

export default Accounts;
