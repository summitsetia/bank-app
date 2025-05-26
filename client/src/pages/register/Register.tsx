import { useState } from 'react';
import bankLogo from '../../assets/bankLogo.svg';
import { useNavigate } from "react-router-dom";
import client from '../api/axiosClient';
import Button from '../../components/Button';
import checkUsername from '../api/UsernameCheck';
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
        <div className="flex justify-center items-center h-screen">
            <div className="bg-[#fcfcfc] border rounded-2xl h-132 w-132 flex flex-col items-center justify-center">
                <img className="w-28 h-28" src={bankLogo} alt="Bank Logo" />
                <h1 className="text-[#003366] font-semibold text-3xl mb-4 mt-4">Sign Up</h1>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input className="p-2 rounded border" placeholder="First Name" name="fName" onChange={handleChange} value={registerData.fName} required/>
                    <input className="p-2 rounded border" placeholder="Last Name" name="lName" onChange={handleChange} value={registerData.lName} required/>
                    <input className="p-2 rounded border" placeholder="Email" name="email" onChange={handleChange} value={registerData.email} required/>
                    <input className="p-2 rounded border" placeholder="Password" name="password" onChange={handleChange} type="password" value={registerData.password} required/>
                    <div className="relative">
                        <input
                            className="p-2 rounded border w-full pr-10"
                            placeholder="Username"
                            name="username"
                            onChange={handleChange}
                            onBlur={handleCheckUsername}
                            value={registerData.username}
                            required
                        />
                        
                        {isPending && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <Ellipsis />
                            </div>
                        )}

                        {isSuccess && !userFound && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                                <Check />
                            </div>
                        )}
                        {isSuccess && userFound && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600">
                                <X />
                            </div>
                        )}
                    </div>
                    <Button content={"Join"}/>
                </form>
            </div>
        </div>
    );
};

export default Register;
