import React, { useCallback, useEffect, useState } from 'react'

const VoiceChat = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [recognition, setRecognition] = useState(null)
    const [currentAnswer, setCurrentAnswer] = useState(null)
    const [status, setStatus] = useState({ message: '시작 버튼을 눌러주세요', type: 'normal' })
    const [isStarted, setIsStarted] = useState(false)
    const [responses, setResponses] = useState([])
    const [isFinished, setIsFinished] = useState(false)

    const questions = [
        '오늘 기분은 어떠신가요?',
        '주말에는 주로 무엇을 하시나요?',
        '가장 좋아하는 음식은 무엇인가요?'
    ]

    const progressPercentage = Math.round(((currentStep + 1) / questions.length) * 100)

    const updateStatus = useCallback((message, type = 'normal', isListening = false) => {
        setStatus({ message, type, isListening })
    }, [])

    const startConversation = useCallback(() => {
        setIsStarted(true)
        setIsFinished(false)
        setResponses([])
        setCurrentStep(0)
    }, [])

    const handleNextQuestion = useCallback(() => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            setIsFinished(true)
            setIsStarted(false)
        }
    }, [currentStep, questions.length])

    useEffect(() => {
        return () => {
            speechSynthesis.cancel()
        }
    }, [])

    return (
        <div className="w-full h-screen flex flex-col relative">
            {/* 프로그래스바 */}
            <div className="fixed top-0 left-0 w-full bg-gray-200 h-2 z-[1000]">
                <div
                    className="bg-blue-600 h-2 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}></div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex flex-col justify-center items-center flex-grow mt-4">
                <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h1 className="text-xl font-bold">음성 대화 테스트</h1>
                        <div>
                            {currentStep + 1} / {questions.length}
                        </div>
                    </div>

                    {!isStarted ? (
                        <button
                            onClick={startConversation}
                            className="w-full py-3 mb-4 bg-black text-white rounded-lg hover:opacity-90 transition">
                            대화 시작
                        </button>
                    ) : (
                        <>
                            <p className="text-center text-lg font-medium mb-4">
                                {questions[currentStep]}
                            </p>
                            <button
                                onClick={handleNextQuestion}
                                className={`w-full py-3 mb-4 ${
                                    currentStep === questions.length - 1
                                        ? 'bg-green-600 hover:opacity-90'
                                        : 'bg-blue-600 hover:opacity-90'
                                } text-white rounded-lg transition`}>
                                {currentStep === questions.length - 1
                                    ? '결과 보기'
                                    : '다음 질문으로'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VoiceChat
