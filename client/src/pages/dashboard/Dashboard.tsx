import { type JSX } from 'react';
import { BadgeDollarSign, PiggyBank, SquarePlus, Vault } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createAccountsQuery } from '../../api/accounts';
import { createTransactionQuery } from '../../api/transactions';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const accountIcons: { [key: string]: JSX.Element } = {
    "Jumpstart": <BadgeDollarSign />,
    "Savings": <PiggyBank />,
    "Term Deposit": <Vault />
  }

  const { data: accountData } = useQuery(createAccountsQuery())
  const { data: transactionData } = useQuery(createTransactionQuery())

  const balanceSum = accountData?.accountData.reduce((accumulator, current) => {
    return accumulator + Number(current.balance);
  }, 0)

  const spendingSum = transactionData?.data.reduce((accumulator, current) => {
    return accumulator + Number(current.amount)
  }, 0)

  return (
    <div className="flex flex-col w-full max-w-screen-xl mx-auto my-4 space-y-8">
      <div className="flex justify-between items-center w-full px-6 py-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl shadow-md">
        <div className='flex items-center gap-4'>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">👤</div>
          <div className='flex flex-col'>
            <h1 className='text-base font-light'>Welcome Back,</h1>
            <p className="text-xl font-bold">{accountData?.userData.first_name} {accountData?.userData.last_name}</p>
          </div>
        </div>
        <div className="">
          <p className="text-sm">Total Balance</p>
          <p className="text-2xl font-bold">${balanceSum?.toFixed(2)}</p>
        </div>
      </div>


      <div className='flex flex-col space-y-8'>
        <div className="flex flex-col items-center mt-8 rounded-2xl px-4 py-4 min-h-48 bg-white shadow-md p-6">
          <h1 className='text-xl font-semibold text-gray-700'>All Accounts</h1> 
          <div className='flex justify-evenly pt-4 w-full'>
            {accountData?.accountData.map((account) => (
              <div className='flex flex-col items-center bg-white rounded-2xl shadow-md py-6 px-12'>
                <div className='mb-2 text-blue-600'>
                  {accountIcons[account.account_type] || null}
                </div>
                <h2 className='text-2xl font-bold text-gray-800'>{account.account_name}</h2>
                <h2 className='text-lg font-semibold text-gray-800'>{account.account_type}</h2>
                <h1 className='text-xl font-bold text-gray-900'>${account.balance}</h1>
                <p className='text-xs text-gray-500 mt-2'>Opened: {new Date(account.created_at).toDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='flex space-x-4'>
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 overflow-y-auto max-h-64">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="grid grid-cols-4 gap-4 px-2 pb-2 border-b text-sm font-semibold text-gray-500">
              <span>Type</span>
              <span>Amount</span>
              <span>Description</span>
              <span>Date</span>
            </div>
            <div className="flex flex-col text-sm">
              {transactionData?.data.map((transaction, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 px-2 py-2 items-center">
                  <span className="text-gray-800">{transaction.transaction_type}</span>
                  <span className="text-green-600 font-medium">${Number(transaction.amount).toFixed(2)}</span>
                  <span className="text-gray-600 truncate max-w-[180px]">{transaction.description}</span>
                  <span className="text-gray-400 text-xs">{new Date(transaction.created_at).toDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl p-6 w-1/3 bg-white shadow-md">
            <h1 className='text-2xl font-semibold text-gray-800 mb-4'>Spending Summary This Month</h1>
            <h1 className='text-6xl font-bold text-red-500'>${spendingSum}</h1>
          </div>
        </div>

        <div className="flex flex-col items-center border w-full max-w-2xl mx-auto rounded-xl shadow-md bg-white px-6 py-4">
          <h1 className='text-xl font-semibold text-gray-700'>Quick Actions</h1>
          <div className='flex justify-evenly pt-4 w-full'>
              <div className='flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl transition duration-200 hover:bg-gray-100 hover:shadow-md w-40 text-center' onClick={() => navigate("/accounts")}>
                <SquarePlus size={64}/>
                <p className='text-sm font-medium text-gray-600'>Open New Account</p>
              </div>
              <div className='flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl transition duration-200 hover:bg-gray-100 hover:shadow-md w-40 text-center' onClick={() => navigate("/transactions")}>
                <SquarePlus size={64}/>
                <p className='text-sm font-medium text-gray-600'>Create New Transaction</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
