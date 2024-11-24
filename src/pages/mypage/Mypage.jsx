import StatisticalGraph from '@/components/mypage/StatisticalGraph';
import UserInfo from '@/components/mypage/UserInfo';

const Mypage = () => {
    return (
        <div className="h-full">
            {/* 메인 컨테이너 */}
            <div className="max-w-4xl h-full mx-auto flex flex-col gap-8 py-8 px-4">
                {/* 유저 정보 섹션 */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">나의 정보</h2>
                    <UserInfo />
                </div>

                {/* 통계 시각화 섹션 */}
                <div className="bg-white shadow-md rounded-lg p-6  max-h-[1200px]">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">통계 시각화 그래프</h2>
                    <StatisticalGraph />
                </div>
            </div>
        </div>
    );
};

export default Mypage;
