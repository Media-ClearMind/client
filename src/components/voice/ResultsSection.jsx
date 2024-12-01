const ResultsSection = ({ responses, evaluations, onRestart, onNavigate }) => {
    return (
        <div className="w-full h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold">대화 결과</h1>
            <div className="w-full max-w-3xl">
                {responses.map((response, index) => (
                    <div
                        key={index}
                        className="p-4 bg-gray-100 rounded-lg mb-4">
                        <p>Q: {response.question}</p>
                        <p>A: {response.answer}</p>
                        <p>평가: {evaluations[index]?.['적절성'] || '분석 중'}</p>
                    </div>
                ))}
            </div>
            <button onClick={onRestart}>다시 시작하기</button>
            <button onClick={onNavigate}>마이페이지로 이동</button>
        </div>
    )
}

export default ResultsSection
