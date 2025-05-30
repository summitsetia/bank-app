import { useState, type JSX } from "react"
import AccountForm from "./AccountForm"
import { useQuery } from "@tanstack/react-query"
import { ArrowDownRight, ArrowUpRight, BadgeDollarSign, Calendar, CreditCard, DollarSign, PiggyBank, Plus, TrendingUp, Vault } from "lucide-react"
import { createAccountsQuery } from "../../api/accounts"

const Accounts = () => {
    const accountIcons: { [key: string]: JSX.Element } = {
        "Jumpstart": <BadgeDollarSign />,
        "Savings": <PiggyBank />,
        "Term Deposit": <Vault />
    }

    const [isShown, setIsShown] = useState<boolean>(false);

    const { data: accountData } = useQuery(createAccountsQuery())

    const reverseState = () => {
        setIsShown((prevValue) => !prevValue)
    }

    const accountColors: { [key: string]: string } = {
      "Jumpstart": "bg-blue-50 text-blue-600 border-blue-200",
      "Savings": "bg-green-50 text-green-600 border-green-200",
      "Term Deposit": "bg-purple-50 text-purple-600 border-purple-200"
    }

    const accountsByType = accountData?.accountData.reduce((acc, account) => {
      const type = account.account_type;
      if (!acc[type]) {
          acc[type] = [];
      }
      acc[type].push(account);
      return acc;
    }, {} as Record<string, any[]>) || {};

    const accountTypeStats = Object.entries(accountsByType).map(([type, accounts]) => ({
      type,
      count: accounts.length,
      totalBalance: accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)
    }));

    return (
        // <div className="flex flex-col h-screen w-full max-w-screen-xl mx-auto">
        //     <div className="flex justify-center p-4">
        //         <button onClick={reverseState}>Open New Account</button> 
        //     </div>
            
        //     <div className="flex justify-center mt-[1vh]">
        //         {isShown && <AccountForm reverseState={reverseState} />}
        //     </div>
        //     <div className='flex justify-evenly pt-4 w-full'>
        //     {data?.accountData.map((account) => (
        //       <div className='flex flex-col items-center bg-white rounded-2xl shadow-md p-6'>
        //         <div className='mb-2 text-blue-600'>
        //           {accountIcons[account.account_type] || null}
        //         </div>
        //         <h2 className='text-2xl font-bold text-gray-800'>{account.account_name}</h2>
        //         <h1 className='text-lg font-semibold text-gray-800'>{account.account_type}</h1>
        //         <h1 className='text-xl font-bold text-gray-900'>${account.balance}</h1>
        //         <p className='text-xs text-gray-500 mt-2'>Opened: {new Date(account.created_at).toDateString()}</p>
        //       </div>
        //     ))}
        //   </div>
        // </div>

    <div className='min-h-screen bg-gray-50 w-full'>

      <div className="flex justify-center mt-[1vh]">
        {isShown && <AccountForm reverseState={reverseState} />}
      </div>

      <div className='max-w-7xl mx-auto p-6 space-y-6'>

        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='flex items-center justify-between mb-2'>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Accounts</h1>
              <p className="text-gray-500 mt-1">Manage your bankings accounts and view balances</p>
            </div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200 font-semibold flex items-center gap-2"
              type="submit" onClick={reverseState}
            >
              <Plus className="w-5 h-5" />
              Open New Account
            </button>
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className="text-sm font-medium text-gray-500">Total Accounts</h3>
              <div className='w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center'>
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{accountData?.accountData?.length || 0}</p>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
             <div className='flex items-center justify-between mb-2'>
              <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
              <div className='w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center'>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className='text-2xl font-bold text-gray-900'>
            </p>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
             <div className='flex items-center justify-between mb-2'>
              <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
              <div className='w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center'>
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
             <div className='flex items-center justify-between mb-2'>
              <h3 className="text-sm font-medium text-gray-500">Newest Account</h3>
              <div className='w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center'>
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>                    
        </div>

        {accountTypeStats.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Types Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {accountTypeStats.map(({ type, count, totalBalance }) => (
                                <div key={type} className={`rounded-lg border-2 p-4 ${accountColors[type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        {accountIcons[type] || <CreditCard className="w-5 h-5" />}
                                        <h3 className="font-semibold">{type}</h3>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm opacity-80">{count} account{count !== 1 ? 's' : ''}</p>
                                        <p className="text-lg font-bold">
                                            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
      </div>
    </div>
    )
}

export default Accounts;
