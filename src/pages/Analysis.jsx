import React, { useEffect, useState } from 'react'

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

    const updateStatus = (message, type = 'normal', isListening = false) => {
        setStatus({ message, type, isListening })
    }

    const speak = text => {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = 'ko-KR'
            utterance.onend = resolve
            updateStatus(`🔊 말하는 중: ${text}`)
            speechSynthesis.speak(utterance)
        })
    }

    const stopRecognition = () => {
        if (recognition) {
            recognition.stop()
            setRecognition(null)
        }
    }

    const listen = async () => {
        stopRecognition()

        return new Promise((resolve, reject) => {
            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                const newRecognition = new SpeechRecognition()
                newRecognition.lang = 'ko-KR'
                newRecognition.interimResults = false
                newRecognition.maxAlternatives = 1

                let isAnswered = false

                newRecognition.onstart = () => {
                    updateStatus('🎤 듣고 있습니다...', 'normal', true)
                }

                newRecognition.onresult = event => {
                    const text = event.results[0][0].transcript
                    if (text.trim()) {
                        setCurrentAnswer(text)
                        isAnswered = true
                        updateStatus('답변이 완료되었습니다.', 'success')
                        resolve(text)
                    } else {
                        handleNoSpeech()
                        reject(new Error('음성이 인식되지 않았습니다'))
                    }
                }

                newRecognition.onerror = event => {
                    handleNoSpeech()
                    reject(new Error(`음성 인식 오류: ${event.error}`))
                }

                newRecognition.onend = () => {
                    if (!isAnswered) {
                        handleNoSpeech()
                    }
                }

                setRecognition(newRecognition)
                newRecognition.start()
            } catch (err) {
                reject(new Error('음성 인식을 시작할 수 없습니다'))
            }
        })
    }

    const handleNoSpeech = () => {
        updateStatus('답변이 정확히 인식되지 않았습니다. 다시 시도해주세요.', 'error')
    }

    const retry = async () => {
        setCurrentAnswer(null)
        updateStatus('다시 답변을 시도합니다.')
        await listen()
    }

    const handleNextQuestion = async () => {
        stopRecognition()

        if (currentAnswer) {
            setResponses(prev => [
                ...prev,
                {
                    question: questions[currentStep],
                    answer: currentAnswer
                }
            ])
            setCurrentAnswer(null)
        }

        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1)
            await startQuestion(currentStep + 1)
        } else {
            updateStatus('모든 대화가 완료되었습니다.', 'success')
            setIsFinished(true) // 대화 종료 플래그 설정
            setIsStarted(false)
        }
    }

    const startQuestion = async stepIndex => {
        try {
            await speak(questions[stepIndex])
            await listen()
        } catch (error) {
            console.error('Question error:', error)
        }
    }

    const startConversation = async () => {
        try {
            setResponses([])
            setCurrentStep(0)
            setCurrentAnswer(null)
            setIsStarted(true)
            setIsFinished(false)

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach(track => track.stop())

            await startQuestion(0)
        } catch (error) {
            console.error('Conversation error:', error)
            updateStatus(`오류가 발생했습니다: ${error.message}`, 'error')
            setIsStarted(false)
        }
    }

    useEffect(() => {
        return () => {
            stopRecognition()
            speechSynthesis.cancel()
        }
    }, [])

    if (isFinished) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <div className="w-full max-w-3xl p-6 bg-white rounded-lg">
                    <h1 className="text-2xl font-bold mb-4 text-center">대화 결과</h1>
                    {responses.map((response, index) => (
                        <div
                            key={index}
                            className="my-4 p-4 bg-gray-100 rounded-lg">
                            <div className="font-bold text-gray-600">Q: {response.question}</div>
                            <div className="text-gray-800 mt-1">A: {response.answer}</div>
                        </div>
                    ))}
                    <button
                        onClick={startConversation}
                        className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:opacity-90 transition">
                        다시 시작하기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-full max-w-3xl p-6 bg-white rounded-lg">
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
                        {!currentAnswer && (
                            <button
                                onClick={retry}
                                className="w-full py-3 mb-4 bg-red-600 text-white rounded-lg hover:opacity-90 transition">
                                다시 답변하기
                            </button>
                        )}
                        <button
                            onClick={handleNextQuestion}
                            className={`w-full py-3 mb-4 ${
                                currentStep === questions.length - 1
                                    ? 'bg-green-600 hover:opacity-90'
                                    : 'bg-blue-600 hover:opacity-90'
                            } text-white rounded-lg transition`}>
                            {currentStep === questions.length - 1 ? '결과 보기' : '다음 질문으로'}
                        </button>
                    </>
                )}

                <div
                    className={`text-center p-4 rounded ${
                        status.type === 'error'
                            ? 'bg-red-100 text-red-600'
                            : status.type === 'success'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-800'
                    }`}>
                    {status.message}
                </div>
            </div>
        </div>
    )
}

export default VoiceChat
