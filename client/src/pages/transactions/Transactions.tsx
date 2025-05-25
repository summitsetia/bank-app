import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import TransactionForm from "./TransactionForm";
import client from "../api/axiosClient";

const Transactions = () => {
  const navigate = useNavigate()
  const [isShown, setIsShown] = useState<boolean>(false);

  const reverseState = () => {
      setIsShown((prevValue) => !prevValue)
  }

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await client.post('/authenticate', {}) 
        const isUserAuthenticated = response.data.isAuthenticated
        console.log(isUserAuthenticated)
        if(!isUserAuthenticated) {
          navigate("/")
        }
      } catch (error) {
        console.log(error)
        navigate("/")
      }
    }

    authenticate()
  }, [])

  return (
    <div className="flex flex-col h-screen w-full max-w-screen-xl mx-auto">
        <div className="flex justify-center p-4">
            <button onClick={reverseState}>New Transaction</button> 
        </div>
        
        <div className="flex justify-center mt-[1vh]">
            {isShown && <TransactionForm reverseState={reverseState} />}
        </div>
    </div>
  );
};


export default Transactions;
