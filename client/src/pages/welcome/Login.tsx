import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

const Login = () => {
    
    interface LoginData {
        email: string;
        password: string;
    }

    const navigate = useNavigate();
    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setLoginData(prevValue => ({
            ...prevValue,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', loginData,  { withCredentials: true });
            const isUserAuthenticated = response.data.isAuthenticated
            if(isUserAuthenticated === true) {
                navigate("/dashboard");
            } 
        } catch (err) {
            console.log(err);
        }
    }; 

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className='mt-8 p-4'>
                <input className='w-64 border rounded-lg p-3' name="email" placeholder='email' value={loginData.email} onChange={handleChange}/>
            </div>
            <div className='p-4'>
                <input className='w-64 border rounded-lg p-3' name="password" type="password" placeholder='password' value={loginData.password} onChange={handleChange}/>
            </div>
            <button className='w-64 border p-1 mb-12 cursor-pointer ' type="submit">Login</button>
        </form>
    );
};

export default Login;
