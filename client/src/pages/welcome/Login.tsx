import { useState } from "react"
import { useNavigate } from "react-router-dom";
import client from "../../api/axiosClient";
import Button from "../../components/Button";

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
            const response = await client.post('/login', loginData);
            const isUserAuthenticated = response.data.isAuthenticated
            if (isUserAuthenticated === true) {
                navigate("/dashboard");
            } 
        } catch (err) {
            console.log(err);
        }
    }; 

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                </label>
                <input 
                    id="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-400" 
                    name="email" 
                    type="email"
                    placeholder="Enter your email" 
                    value={loginData.email} 
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                </label>
                <input 
                    id="password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-400" 
                    name="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={loginData.password} 
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="pt-2">
                <Button content={"Sign In"}/>
            </div>
        </form>
    );
};

export default Login;