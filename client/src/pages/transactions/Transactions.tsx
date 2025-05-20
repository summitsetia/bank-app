import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await axios.post('http://localhost:3000/authenticate', {}, { withCredentials: true }) 
        const isUserAuthenticated = response.data.isAuthenticated
        console.log(isUserAuthenticated)
        if(isUserAuthenticated === true) {
          setIsAuthenticated(true)
        } else {
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
    <>
      {isAuthenticated && (
        <div>
          <h1>Transactions</h1>
        </div>
      )}
    </>
  );
};


export default Transactions;
