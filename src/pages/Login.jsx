import { Link, useNavigate } from 'react-router-dom'

import Auth from '@/lib/api/auth'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import LogoIcon from '@/assets/images/logo-full-transparent.png'
import { useState } from 'react'

function LoginPage() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPW, setShowPW] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPW(!showPW)
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
        }

        setError(errorMessage)
    }

    const onSubmit = async e => {
        e.preventDefault()
        setError('')

        if (isLoading || email === '' || password === '') {
            setError('모든 필드를 채워주세요.')
            return
        }

        setLoading(true)

        try {
            const response = await Auth.loginUser({ email, password }) // username 대신 email 사용
            console.log('로그인 성공:', response)

            localStorage.setItem('token', response.token)
            navigate('/home')
        } catch (error) {
            console.error('로그인 실패:', error)
            setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md bg-white rounded-lg p-6">
                <h2 className="text-center text-2xl font-bold mb-8">
                    <img
                        src={LogoIcon}
                        alt="Logo"
                        className="mx-auto w-[50px] h-[50px]"
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
                {error && (
                    <p className="text-sm text-red-600 flex items-center mt-2">
                        <IoMdInformationCircleOutline className="mr-1" />
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 mt-6 text-white font-bold rounded-md ${
                        isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                    {isLoading ? '로딩중...' : '로그인'}
                </button>
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-700">
                    <Link
                        to="/signup"
                        className="text-blue-600 hover:underline">
                        회원가입하기 &rarr;
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default LoginPage
