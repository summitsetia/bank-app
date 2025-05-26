import { useState } from 'react';
import bankLogo from '../../assets/bankLogo.svg';
import { useNavigate } from "react-router-dom";
import client from '../api/axiosClient';
import Button from '../../components/Button';
import usernameCheck from '../api/CheckUsername';

interface RegisterData {
    fName: string;
    lName: string;
    email: string;
    password: string;
    username: string;
}

const Register = () => {
    const navigate = useNavigate();
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

    const handleCheckUsername = () => {
        mutation.mutate({})
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
                    <input className="p-2 rounded border" placeholder="Username" name="username" onChange={handleChange} value={registerData.username} required/>
                    <Button content={"Join"}/>
                </form>
            </div>
        </div>
    );
};

export default Register;
