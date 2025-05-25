import { useState } from 'react';
import bankLogo from '../../assets/bankLogo.svg';
import { useNavigate } from "react-router-dom";
import client from '../api/axiosClient';

interface RegisterData {
    fName: string;
    lName: string;
    email: string;
    password: string;
}

const Register = () => {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState<RegisterData>({
        fName: '',
        lName: '',
        email: '', 
        password: ''
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

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-[#fcfcfc] border rounded-2xl h-132 w-132 flex flex-col items-center justify-center">
                <img className="w-28 h-28" src={bankLogo} alt="Bank Logo" />
                <h1 className="text-[#003366] font-semibold text-3xl mb-4 mt-4">Sign Up</h1>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <input className="p-2 rounded border" placeholder="First Name" name="fName" onChange={handleChange} value={registerData.fName} />
                    <input className="p-2 rounded border" placeholder="Last Name" name="lName" onChange={handleChange} value={registerData.lName} />
                    <input className="p-2 rounded border" placeholder="Email" name="email" onChange={handleChange} value={registerData.email} />
                    <input className="p-2 rounded border" placeholder="Password" name="password" onChange={handleChange} type="password" value={registerData.password} />
                    <button className="bg-[#003366] text-white p-2 rounded font-bold cursor-pointer " type="submit">Join</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
