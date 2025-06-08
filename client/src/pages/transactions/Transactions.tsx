import { useState } from 'react';
import TransactionForm from "./TransactionForm";
import { useQuery } from '@tanstack/react-query';
import { createTransactionQuery } from '../../api/transactions';
import { ArrowDownRight, ArrowUpRight, Calendar, DollarSign, Filter, Plus, Search, Send, CreditCard, Users } from 'lucide-react';

const Transactions = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>('all');
  const { data: transactionData } = useQuery(createTransactionQuery())

  const reverseState = () => {
    setIsShown((prevValue) => !prevValue)
  }

  const getTransactionIcon = (type: string) => {
    if (type === "Payment") {
      return <CreditCard className="w-5 h-5 text-red-600" />;
    } else if (type === "Transfer") {
      return <Send className="w-5 h-5 text-blue-600" />;
    } else if (type === "PayToPerson") {
      return <Users className="w-5 h-5 text-purple-600" />;
    } else {
      return <ArrowUpRight className="w-5 h-5 text-green-600" />;
    }
  };

  const isIncomeTransaction = (transaction: any) => {
    return transaction.transaction_type === 'Income';
  };

  const allTransactions = transactionData?.allData ? 
    [...transactionData.allData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) 
    : [];

  const filteredTransactions = allTransactions.filter((transaction) => {
    const filteredSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          transaction.transaction_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.transaction_type?.toLowerCase() === filterType.toLowerCase()
    return filteredSearch && matchesFilter
  });

  const totalIncome = transactionData?.allData?.filter(t => isIncomeTransaction(t))
    .reduce((accumulator, income) => accumulator + Number(income.amount), 0) || 0;

  const totalSpending = transactionData?.allData?.filter((t) => !isIncomeTransaction(t))
    .reduce((accumulator, t) => accumulator + Number(t.amount), 0) || 0;

  const thisMonthTransactions = transactionData?.allData?.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at);
    const currentDate = new Date();
    return transactionDate.getMonth() === currentDate.getMonth() && 
           transactionDate.getFullYear() === currentDate.getFullYear();
  }) || [];

  return (
    <div className='min-h-screen bg-gray-50 w-full'>

      <div className="flex justify-center mt-[1vh]">
        {isShown && <TransactionForm reverseState={reverseState} />}
      </div>

      <div className='max-w-7xl mx-auto px-6 space-y-6'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='flex items-center justify-between mb-2'>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
              <p className="text-gray-500 mt-1">Manage and view your transaction history</p>
            </div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200 font-semibold flex items-center gap-2"
              type="submit" onClick={reverseState}
            >
              <Plus className="w-5 h-5" />
              New Transaction
            </button>
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
              <div className='w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center'>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{transactionData?.allData?.length || 0}</p>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
             <div className='flex items-center justify-between mb-2'>
              <h3 className="text-sm font-medium text-gray-500">This Month</h3>
              <div className='w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center'>
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className='text-2xl font-bold text-gray-900'>{thisMonthTransactions.length}</p>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
             <div className='flex items-center justify-between mb-2'>
              <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
              <div className='w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center'>
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className='text-2xl font-bold text-gray-900'>${totalIncome.toFixed(2)}</p>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
             <div className='flex items-center justify-between mb-2'>
              <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
              <div className='w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center'>
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className='text-2xl font-bold text-gray-900'>${totalSpending.toFixed(2)}</p>
          </div>                    
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='flex gap-4'>
            <div className='flex-1 relative'>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder='Search Transactions...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
               />
            </div>
            <div className='relative'>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                 <option value="all">All Types</option>
                 <option value="transfer">Transfer</option>
                 <option value="payment">Payment</option>
                 <option value="paytoperson">PayToPerson</option>
                 <option value="income">Income</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className="text-lg font-semibold text-gray-900">All Transactions</h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {filteredTransactions.length} Transaction(s)
            </span>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className='space-y-2'>
              {filteredTransactions.map((transaction, index) => {
                const isIncome = isIncomeTransaction(transaction);
                const amount = Number(transaction.amount);
                
                return (
                  <div key={index} className='flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors'>
                    <div className='flex items-center gap-4'>
                      <div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center'>
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="capitalize">{transaction.transaction_type}</span>
                          <span>•</span>
                          <span>{new Date(transaction.created_at).toDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}${amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : "You haven't made any transactions yet. Create your first transaction to get started."}
              </p>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200 font-semibold flex items-center mx-auto gap-2"
                type="submit" onClick={reverseState}
              >
                <Plus className="w-5 h-5" />
                New Transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;