import { useState } from 'react';
import TransactionForm from "./TransactionForm";

const Transactions = () => {
  const [isShown, setIsShown] = useState<boolean>(false);

  const reverseState = () => {
      setIsShown((prevValue) => !prevValue)
  }

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
