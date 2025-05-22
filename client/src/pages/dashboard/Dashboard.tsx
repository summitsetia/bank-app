import { useState, useEffect, type JSX } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BadgeDollarSign, PiggyBank, Vault } from 'lucide-react';

const Dashboard = () => {
  interface UserData {
    email: string;
    first_name: string;
    last_name: string;
  }

  interface AccountData {
    account_type: string;
    balance: string;
    created_at: string;
  }


  const accountIcons: { [key: string]: JSX.Element }= {
    "Jumpstart": <BadgeDollarSign />,
    "Savings": <PiggyBank />,
    "Term Deposit": <Vault />
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [accountData, setAccountData] = useState<Array<AccountData> | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await axios.post('http://localhost:3000/authenticate', {}, { withCredentials: true })
        const isUserAuthenticated = response.data.isAuthenticated
        if (!isUserAuthenticated) {
          navigate("/")
        }
      } catch (error) {
        console.log(error)
        navigate("/")
      }
    }

    authenticate()
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/userData', {}, { withCredentials: true });
        console.log(response.data.accountData);
        setUserData(response.data.userData);
        setAccountData(response.data.accountData)
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserData()
  }, [])

  const balanceSum = accountData?.reduce((accumulator, current) => {
    return accumulator + Number(current.balance);
  }, 0)

  return (
    <div className="flex flex-col w-full max-w-screen-xl mx-auto my-4">
      <div className="flex justify-between items-center w-full px-4 py-4 p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl shadow-md">
        <div className='flex items-center gap-4'>
          <h1>Photo</h1>
          <div className='flex flex-col'>
            <h1 className='text-base font-light'>Welcome Back,</h1>
            <p className="text-xl font-bold">{userData?.first_name} {userData?.last_name}</p>
          </div>
        </div>
        <div className="">
          <p className="text-sm">Total Balance</p>
          <p className="text-2xl font-bold">${balanceSum?.toFixed(2)}</p>
        </div>
      </div>


      <div className='flex flex-col space-y-8'>
        <div className="flex flex-col items-center mt-8 border rounded-2xl px-4 py-4 min-h-48">
          <h1 className='text-xl font-semibold text-gray-700'>All Accounts</h1> 
          <div className='flex justify-evenly pt-4 w-full'>
            {accountData?.map((account) => (
              <div className='flex flex-col items-center bg-white rounded-2xl shadow-md p-6'>
                <div className='mb-2 text-blue-600'>
                  {accountIcons[account.account_type] || null}
                </div>
                <h1 className='text-lg font-semibold text-gray-800'>{account.account_type}</h1>
                <h1 className='text-xl font-bold text-gray-900'>${account.balance}</h1>
                <p className='text-xs text-gray-500 mt-2'>Opened: {new Date(account.created_at).toDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='flex space-x-4'>
          <div className="flex-1 flex-col items-center border rounded-2xl px-4 py-4 h-48">
            <h1 className='text-xl font-semibold text-gray-700'>Recent Activity</h1>
            <div className='flex justify-between w-full'>
              <h1>Name</h1>
              <h1>Account</h1>
              <h1>Price</h1>
            </div>
            <div className='flex justify-between w-full'>
              <h1>Name</h1>
              <h1>Account</h1>
              <h1>Price</h1>
            </div>
            <div className='flex justify-between w-full'>
              <h1>Name</h1>
              <h1>Account</h1>
              <h1>Price</h1>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border rounded-2xl px-4 py-4 h-48">
            <h1 className='text-xl font-semibold text-gray-700'>Spending Summary This Month</h1>
            <h1 className='text-7xl'>$NUMBER</h1>
          </div>
        </div>

        <div className="flex justify-center border h-48">
          <h1 className='text-xl font-semibold text-gray-700'>Quick Actions</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
