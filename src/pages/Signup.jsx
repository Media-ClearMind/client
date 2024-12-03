import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Auth from '@/lib/api/auth'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import LogoIcon from '@/assets/images/logo-full-transparent.png'

function SignupPage() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('남성')
    const [occupation, setOccupation] = useState('')
    const [error, setError] = useState('')
    const [showPW, setShowPW] = useState(false)
    const [hasUpperCase, setHasUpperCase] = useState(false)
    const [isFormValid, setFormValid] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPW(!showPW)
    }

    const onChange = e => {
        const { name, value } = e.target
        let errorMessage = ''
        if (name === 'username') {
            setUsername(value)
        } else if (name === 'email') {
            setEmail(value)

            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = '유효한 이메일 형식이 아닙니다.'
            }
        } else if (name === 'password') {
            setPassword(value)

            if (value.length < 6) {
                errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
            }

            setHasUpperCase(/[A-Z]/.test(value))
        } else if (name === 'age') {
            setAge(value)
        } else if (name === 'occupation') {
            setOccupation(value)
        }

        setError(errorMessage)
    }

    useEffect(() => {
        const isAllFieldsValid =
            username.trim() !== '' &&
            email.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
            password.length >= 6 &&
            age.trim() !== '' &&
            occupation.trim() !== ''

        setFormValid(isAllFieldsValid)
    }, [username, email, password, age, occupation])

    const onSubmit = async e => {
        e.preventDefault()
        setError('')

        if (!isFormValid || isLoading) return

        setLoading(true)

        try {
            const response = await Auth.registerUser({
                name: username, // username을 name으로 매핑
                email,
                password,
                age: parseInt(age, 10),
                gender,
                occupation
            })
            console.log('회원가입 성공:', response)
            navigate('/login')
        } catch (error) {
            console.error('회원가입 실패:', error)
            setError('회원가입 중 문제가 발생했습니다. 다시 시도해주세요.')
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
                        className="block text-sm text-black font-bold mb-2"
                        htmlFor="username">
                        닉네임
                    </label>
                    <input
                        type="text"
                        name="username"
                        placeholder="닉네임을 입력해주세요"
                        value={username}
                        onChange={onChange}
                        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-black"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-sm text-black font-bold mb-2"
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
                        className="block text-sm text-black font-bold mb-2"
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
                <div className="mb-4">
                    <label
                        className="block text-sm text-black font-bold mb-2"
                        htmlFor="age">
                        나이
                    </label>
                    <input
                        type="number"
                        name="age"
                        placeholder="나이를 입력해주세요"
                        value={age}
                        onChange={onChange}
                        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-black"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-sm text-black font-bold mb-2"
                        htmlFor="occupation">
                        직업
                    </label>
                    <input
                        type="text"
                        name="occupation"
                        placeholder="직업을 입력해주세요"
                        value={occupation}
                        onChange={onChange}
                        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-black"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-sm text-black font-bold mb-2"
                        htmlFor="gender">
                        성별
                    </label>
                    <select
                        name="gender"
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-black">
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                    </select>
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
                    disabled={!isFormValid || isLoading}
                    className={`w-full py-3 mt-6 text-white font-bold rounded-md ${
                        isFormValid ? 'bg-blue-600' : 'bg-blue-300'
                    }`}>
                    {isLoading ? '로딩중...' : '계정 생성하기'}
                </button>
                <p className="mt-6 text-center text-sm text-black">
                    이미 계정이 있으신가요?{' '}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline">
                        로그인하기 &rarr;
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default SignupPage
