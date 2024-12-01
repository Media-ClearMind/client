import StatisticalGraph from '@/components/mypage/StatisticalGraph'
import UserInfo from '@/components/mypage/UserInfo'
import { useNavigate } from 'react-router-dom'

const Mypage = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        // localStorage에서 인증 정보 삭제
        localStorage.removeItem('token')
        localStorage.removeItem('userId')

        // 루트 경로로 이동
        navigate('/')
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* 메인 콘텐츠 영역 */}
            <div className="flex-grow pb-16">
                {/* Footer 높이를 고려해 padding-bottom 추가 */}
                <div className="max-w-4xl mx-auto flex flex-col gap-8 py-8 px-4">
                    {/* 유저 정보 섹션 */}
                    <div>
                        <UserInfo />
                    </div>

                    {/* 통계 시각화 섹션 */}
                    <div className="bg-white shadow-md rounded-lg p-6 max-h-[1200px]">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">통계 시각화 그래프</h2>
                        <StatisticalGraph />
                    </div>
                </div>

                <div className="w-full py-4">
                    <div className="max-w-4xl mx-auto flex justify-end px-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition">
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mypage
