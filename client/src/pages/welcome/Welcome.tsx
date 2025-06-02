import bankLogo from '../../assets/bankLogo.png'
import client from '../../api/axiosClient';
import Login from './Login'
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthenticated = async () => {
      const response = await client.post("/authenticate", {})
      const isUserAuthenticated = response.data.isAuthenticated
      console.log(isUserAuthenticated)
      if (isUserAuthenticated) {
        navigate("/dashboard")
      }
    }
    checkAuthenticated()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        <div className="text-center lg:text-left space-y-6">
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

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to your account</p>
            </div>

            <Login />

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-center text-slate-600 text-sm mb-4">
                Don't have an account?
              </p>
              <Link to="/register">
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg border border-slate-300 transition-colors duration-200">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome;