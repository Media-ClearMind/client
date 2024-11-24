import BlueLogoIcon from '@/assets/images/logo-transparent.png'
import { useNavigate } from 'react-router-dom'

const WelcomePage = () => {
    const navigate = useNavigate()

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-10 overflow-x-hidden overflow-y-auto">
            {/* Logo */}
            <img
                src={BlueLogoIcon}
                alt="Logo"
                className="w-40 mb-44 mt-20"
            />

            {/* Signup Button */}
            <button
                onClick={() => navigate('/signup')}
                className="w-full h-12 bg-blue-600 text-white rounded-lg font-bold text-base mb-2 hover:bg-blue-700">
                회원가입
            </button>

            {/* Login Button */}
            <button
                onClick={() => navigate('/login')}
                className="w-full h-12 bg-gray-100 text-blue-600 rounded-lg font-bold text-base mb-2 hover:bg-gray-200">
                로그인
            </button>
        </div>
    )
}

export default WelcomePage
