import DDayCounter from '@/components/main/DdayCounter' // DDayCounter 컴포넌트 import
import { Link } from 'react-router-dom'
import LogoIcon from '@/assets/images/logo-full-transparent.png'
import MaintenanceGoals from '@/components/main/Main' // MaintenanceGoals 컴포넌트 import
import axios from 'axios'
import { useEffect } from 'react'
import useUserStore from '../stores/useUserStore'

const HomePage = () => {
    const { setUser } = useUserStore()
    const user = useUserStore(state => state.user)
    const userName = user ? user.data.name : '익명'

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token') // 토큰 가져오기
            if (!token) {
                throw new Error('Token not found') // 토큰이 없을 경우 에러 처리
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // 토큰 포함
                    }
                }
            )
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // 더미 데이터
    const dummyDDay = 30
    const dummyGoal = '앞으로도 꾸준히 !'

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-black">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-6">
                <div className="text-2xl font-bold text-blue-600">
                    <img
                        src={LogoIcon}
                        alt="Logo"
                        className="mx-auto w-[35px] h-[35px]"
                    />
                </div>
                <Link
                    to="/analysis"
                    className="text-blue-600 hover:text-blue-700">
                    검사 하러 가기
                </Link>
            </header>

            {/* Top Container */}
            <div className="px-8 py-4 text-center">
                <div className="space-y-2">
                    <h1 className="text-xl font-bold text-left">안녕하세요, {userName}님</h1>
                    <h2 className="text-xl font-bold text-left">오늘도 목표를 달성해보세요!</h2>
                </div>
            </div>

            {/* Bottom Container */}
            <div className="flex-1 bg-white rounded-t-3xl px-4 py-8">
                {/* DDayCounter 추가 */}
                <DDayCounter
                    dDay={dummyDDay}
                    myGoal={dummyGoal}
                />
                {/* MaintenanceGoals 컴포넌트 호출 */}
                <MaintenanceGoals />
            </div>
        </div>
    )
}

export default HomePage
