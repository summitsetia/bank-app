import { type JSX } from 'react';
import { ArrowUpRight, BadgeDollarSign, Eye, PiggyBank, SquarePlus, TrendingUp, Vault } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createAccountsQuery } from '../../api/accounts';
import { createTransactionQuery } from '../../api/transactions';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const accountIcons: { [key: string]: JSX.Element } = {
    "Jumpstart": <BadgeDollarSign className="w-6 h-6"/>,
    "Savings": <PiggyBank className="w-6 h-6"/>,
    "Term Deposit": <Vault className="w-6 h-6"/>
  }

  const { data: accountData } = useQuery(createAccountsQuery())
  const { data: transactionData } = useQuery(createTransactionQuery())

  const balanceSum = accountData?.accountData?.reduce((accumulator, current) => {
    return accumulator + Number(current.balance);
  }, 0)

  const transactionsOnly = transactionData?.allData?.filter(item => item.transaction_type) || [];
  
  const spendingSum = transactionsOnly.reduce((accumulator, current) => {
    return accumulator + Number(current.amount)
  }, 0)

  const recentTransactions = transactionsOnly.slice(0, 3);
  const fixedAccounts = accountData?.accountData?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='w-full max-w-screen-xl mx-auto my-4 space-y-8'>

        <div className="flex justify-between items-center w-full px-6 py-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-md">
          <div className='flex items-center gap-4'>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">👤</div>
            <div className='flex flex-col'>
              <h1 className='text-base font-light'>Welcome Back,</h1>
              <p className="text-xl font-bold">{accountData?.userData?.first_name} {accountData?.userData?.last_name}</p>
            </div>
          </div>
          <div className="">
            <p className="text-sm text-right">Total Balance</p>
            <p className="text-2xl font-bold">${balanceSum?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Accounts</h3>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <BadgeDollarSign className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{accountData?.accountData?.length || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Monthly Spending</h3>
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">${spendingSum?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Recent Transactions</h3>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{transactionsOnly.length}</p>
          </div>
        </div>


        <div className='flex flex-col space-y-8'>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className='flex items-center justify-between mb-6'>
              <h1 className='text-lg font-semibold text-gray-900'>Your Accounts</h1>
              <button 
              onClick={() => navigate("/accounts")}
              className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 font-medium flex items-center gap-1"
              >
              View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {fixedAccounts.map((account, index) => (
                <div key={account.account_id || index} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer'>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      {accountIcons[account.account_type] || <BadgeDollarSign className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{account.account_name}</h3>
                      <p className="text-sm text-gray-500">{account.account_type}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-gray-900">${Number(account.balance).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Opened: {new Date(account.created_at).toDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className='lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h1 className='text-lg font-semibold text-gray-900'>Recent Activity</h1>
                  <button 
                    onClick={() => navigate("/transactions")}
                    className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              <div className="space-y-3">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500 capitalize">{transaction.transaction_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={"font-semibold text-black"}>
                          ${Number(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.created_at).toDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No recent activity</p>
                  </div>
                )}
                </div>
              </div>

              <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className='space-y-3'>
                  <button 
                    onClick={() => navigate("/accounts")}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <SquarePlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Open New Account</p>
                    <p className="text-sm text-gray-500">Start saving today</p>
                  </div>
                  </button>

                  <button 
                    onClick={() => navigate("/transactions")}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <SquarePlus className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">New Transaction</p>
                    <p className="text-sm text-gray-500">Start creating payments</p>
                  </div>
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;