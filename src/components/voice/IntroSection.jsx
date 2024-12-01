import IntroImage from '@/assets/images/home_pogny.png'

const IntroSection = ({ onStart }) => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center px-4">
            <h1 className="text-2xl font-bold mb-8 text-gray-800">포근이와 대화하기</h1>
            <img
                src={IntroImage}
                alt="인지능력 테스트"
                className="w-[300px] h-[300px] mb-8"
            />
            <button
                onClick={onStart}
                className="w-full max-w-3xl bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                시작하기
            </button>
        </div>
    )
}

export default IntroSection
