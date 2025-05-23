import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AccountForm from "./AccountForm"

const Accounts = () => {
    const navigate = useNavigate()
    const [isShown, setIsShown] = useState<boolean>(false);

    const reverseState = () => {
        setIsShown((prevValue) => !prevValue)
    }

    useEffect(() => {
        const authenticate = async () => {
            try {
                const response = await axios.post('http://localhost:3000/authenticate', {}, { withCredentials: true })
                const isUserAuthenticated = response.data.isAuthenticated
                if (!isUserAuthenticated) {
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
                <button onClick={reverseState}>Open New Account</button> 
            </div>
            
            <div className="flex justify-center mt-[1vh]">
                {isShown && <AccountForm reverseState={reverseState} />}
            </div>
        </div>
    )
}

export default Accounts;
