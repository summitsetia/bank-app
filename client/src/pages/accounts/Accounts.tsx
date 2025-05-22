import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Accounts = () => {

    const navigate = useNavigate()

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
        <div>
            <h1>Accounts</h1>
        </div>
    )
}

export default Accounts;