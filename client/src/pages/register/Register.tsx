import { useState } from 'react';
import bankLogo from '../../assets/bankLogo.png';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import client from '../../api/axiosClient';
import Button from '../../components/Button';
import checkUsername from '../../api/UsernameCheck';
import { useMutation } from "@tanstack/react-query";
import { Check, Ellipsis, X } from 'lucide-react';

interface RegisterData {
    fName: string;
    lName: string;
    email: string;
    password: string;
    username: string;
}

const Register = () => {
    const navigate = useNavigate();
    const [userFound, setUserFound] = useState<boolean>(false);
    const [registerData, setRegisterData] = useState<RegisterData>({
        fName: '',
        lName: '',
        email: '', 
        password: '',
        username: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setRegisterData((prevValue) => ({
            ...prevValue,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userFound) {
            alert("Cannot submit. Username is already taken.");
            return; 
        }
        try {
            const response = await client.post('/register', registerData);
            const isUserAuthenticated = response.data.isAuthenticated
            if (isUserAuthenticated === true) {
                navigate("/dashboard");
            } else {
                console.log(response.data.message)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const { mutate, isPending, isSuccess} = useMutation({
        mutationFn: checkUsername,
        onSuccess: (data) => {
            setUserFound(data.userFound);
        }
    })

    const handleCheckUsername = () => {
        mutate(registerData.username)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                
                <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
                    <div className="flex items-center justify-center lg:justify-start">
                        <img 
                            src={bankLogo} 
                            alt="Bank Logo" 
                            className="w-36 h-auto"
                        />
                        <h1 className="text-5xl font-bold text-slate-800">
                            Bank<span className="text-blue-600">App</span>
                        </h1>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto order-1 lg:order-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Create Account</h2>
                            <p className="text-slate-600">Start your banking journey today</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fName" className="block text-sm font-medium text-slate-700 mb-2">
                                        First Name
                                    </label>
                                    <input 
                                        id="fName"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-400" 
                                        placeholder="First Name" 
                                        name="fName" 
                                        onChange={handleChange} 
                                        value={registerData.fName} 
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lName" className="block text-sm font-medium text-slate-700 mb-2">
                                        Last Name
                                    </label>
                                    <input 
                                        id="lName"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-400" 
                                        placeholder="Last Name" 
                                        name="lName" 
                                        onChange={handleChange} 
                                        value={registerData.lName} 
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <input 
                                    id="email"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-400" 
                                    placeholder="Enter your email" 
                                    name="email" 
                                    type="email"
                                    onChange={handleChange} 
                                    value={registerData.email} 
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
                                    placeholder="Create a password" 
                                    name="password" 
                                    type="password"
                                    onChange={handleChange} 
                                    value={registerData.password} 
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        id="username"
                                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900 placeholder-slate-400 ${
                                            isSuccess && userFound ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                                            isSuccess && !userFound ? 'border-green-300 focus:ring-green-500 focus:border-green-500' : 
                                            'border-slate-300'
                                        }`}
                                        placeholder="Choose a username"
                                        name="username"
                                        onChange={handleChange}
                                        onBlur={handleCheckUsername}
                                        value={registerData.username}
                                        required
                                    />
                                    
                                    {isPending && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                                            <Ellipsis className="animate-pulse" size={20} />
                                        </div>
                                    )}

                                    {isSuccess && !userFound && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                                            <Check size={20} />
                                        </div>
                                    )}
                                    
                                    {isSuccess && userFound && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600">
                                            <X size={20} />
                                        </div>
                                    )}
                                </div>
                                
                                {isSuccess && userFound && (
                                    <p className="text-red-600 text-sm mt-1">Username is already taken</p>
                                )}
                                {isSuccess && !userFound && (
                                    <p className="text-green-600 text-sm mt-1">Username is available</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <Button content={"Create Account"}/>
                            </div>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <p className="text-center text-slate-600 text-sm mb-4">
                                Already have an account?
                            </p>
                            <Link to="/">
                                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg border border-slate-300 transition-colors duration-200">
                                    Sign In Instead
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;