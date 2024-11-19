import { Link, useNavigate } from 'react-router-dom'

import { IoMdInformationCircleOutline } from 'react-icons/io'
import { useState } from 'react'

function LoginPage() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [clicked, setIsClicked] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPW, setShowPW] = useState(false)
    const [hasUpperCase, setHasUpperCase] = useState(false)
    const [showPasswordReset, setShowPasswordReset] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPW(!showPW)
    }

    const handleLoginClick = () => {
        setIsClicked(!clicked)
    }

    const onChange = e => {
        const { name, value } = e.target
        let errorMessage = ''

        if (name === 'email') {
            setEmail(value)

            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = '유효한 이메일 형식이 아닙니다.'
            }
        } else if (name === 'password') {
            setPassword(value)

            if (value.length < 6) {
                errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
            }

            if (value.length === 0) {
                errorMessage = ' '
            }

            setHasUpperCase(/[A-Z]/.test(value))
        }

        setError(errorMessage)
    }

    const onSubmit = async e => {
        e.preventDefault()
        setError('')

        if (isLoading || email === '' || password === '') return

        setLoading(true)

        setTimeout(() => {
            // Simulate login process
            console.log('User Logged In:', { email })
            setLoading(false)
            navigate('/home')
        }, 2000)
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-center text-2xl font-bold mb-8">
                    <img
                        src="/src/assets/icons/earth-logo-horizon.svg"
                        alt="Logo"
                        className="mx-auto"
                    />
                </h2>
                <div className="mb-4">
                    <label
                        className="block text-sm font-bold mb-2 text-gray-700"
                        htmlFor="email">
                        이메일
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="clear_mind@naver.com"
                        value={email}
                        onChange={onChange}
                        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-black"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-sm font-bold mb-2 text-gray-700"
                        htmlFor="password">
                        비밀번호
                    </label>
                    <div className="relative">
                        <input
                            type={showPW ? 'text' : 'password'}
                            name="password"
                            placeholder="비밀번호를 입력해주세요 (6자리 이상)"
                            value={password}
                            onChange={onChange}
                            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-black"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            {showPW ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>
                {hasUpperCase && (
                    <p className="text-sm text-blue-600 flex items-center">
                        <IoMdInformationCircleOutline className="mr-1" />
                        비밀번호에 대문자가 포함되어 있습니다
                    </p>
                )}
                {error && (
                    <p className="text-sm text-red-600 flex items-center mt-2">
                        <IoMdInformationCircleOutline className="mr-1" />
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    onClick={handleLoginClick}
                    disabled={isLoading}
                    className={`w-full py-3 mt-6 text-white font-bold rounded-md ${
                        clicked ? 'bg-blue-600' : 'bg-blue-300'
                    }`}>
                    {isLoading ? '로딩중...' : '로그인'}
                </button>
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-700">
                    <Link
                        to="/signup"
                        className="text-blue-600 hover:underline">
                        회원가입하기 &rarr;
                    </Link>
                    <p
                        onClick={() => setShowPasswordReset(true)}
                        className="text-blue-600 hover:underline cursor-pointer">
                        비밀번호 찾기 &rarr;
                    </p>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-700 mb-4">간편 로그인</p>
                    <div className="flex justify-center space-x-4">
                        <img
                            src="/src/assets/icons/naver-icon.svg"
                            alt="Naver"
                            className="w-10 h-10"
                        />
                        <img
                            src="/src/assets/icons/kakao-round-icon.svg"
                            alt="Kakao"
                            className="w-10 h-10"
                        />
                        <img
                            src="/src/assets/icons/apple-icon.svg"
                            alt="Apple"
                            className="w-10 h-10"
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginPage
