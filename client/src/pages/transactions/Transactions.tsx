import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await axios.post('http://localhost:3000/authenticate', {}, { withCredentials: true }) 
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
    <div className="">
      <h1>Transactions</h1>
    </div>
  );
};


export default Transactions;
