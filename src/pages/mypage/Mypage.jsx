import StatisticalGraph from '@/components/mypage/StatisticalGraph'
import UserInfo from '@/components/mypage/UserInfo'

const Mypage = () => {
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
            </div>
        </div>
    )
}

export default Mypage
