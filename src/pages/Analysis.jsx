import { useEffect, useRef, useState } from 'react'

import IntroImage from '@/assets/images/home_pogny.png' // 인트로 이미지
import { fetchData } from '@/lib/api/util' // fetchData 유틸 함수
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const fetchQuestionFromGPT = async () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `당신은 한국 노인을 위한 인지 능력 평가 질문을 만드는 전문 AI 도우미입니다. 
                        다음 조건을 충족하는 한 개의 명확하고 간단한 질문을 한국어로 생성해 주세요:
                        - 노인이 쉽게 이해할 수 있는 언어로 작성
                        - 기억력, 인지 능력, 일상 기능을 평가하는 질문
                        - 간단하고 명확하게 대답할 수 있는 질문
                        - 한국 문화와 노인의 생활 맥락에 적합한 질문
                        추가 설명 없이 오직 질문만 제공해 주세요.`
                    },
                    {
                        role: 'user',
                        content: '노인의 인지 기능을 평가할 수 있는 진단 질문을 생성해 주세요.'
                    }
                ],
                max_tokens: 50,
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`
                }
            }
        )

        return response.data.choices[0].message.content.trim()
    } catch (error) {
        console.error('GPT 질문 생성 오류:', error)
        throw error
    }
}

const analyzeAnswerWithGPT = async (question, userAnswer) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-0613',
                messages: [
                    {
                        role: 'system',
                        content: `당신은 사용자의 질문과 답변을 평가하는 전문가입니다.
                        다음 내용을 분석하세요:
                        - 답변의 적절성 ("적절함" 또는 "부적절함"으로 평가)
                        - 평가 근거를 간단히 설명.
                        결과는 JSON 형식으로 반환하세요:
                        {
                            "적절성": "적절함" 또는 "부적절함",
                            "이유": "평가 근거"
                        }`
                    },
                    {
                        role: 'user',
                        content: `질문: ${question}\n답변: ${userAnswer}`
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`
                }
            }
        )

        return JSON.parse(response.data.choices[0].message.content.trim())
    } catch (error) {
        console.error('답변 분석 오류:', error)
        return {
            적절성: '오류',
            이유: '분석 실패'
        }
    }
}

const VoiceChat = () => {
    const navigate = useNavigate() // 페이지 이동을 위한 useNavigate 훅
    const [currentStep, setCurrentStep] = useState(0)
    const [recognition, setRecognition] = useState(null)
    const [currentAnswer, setCurrentAnswer] = useState(null)
    const [status, setStatus] = useState({ message: '시작 버튼을 눌러주세요', type: 'normal' })
    const [isStarted, setIsStarted] = useState(false)
    const [responses, setResponses] = useState([])
    const [isFinished, setIsFinished] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isIntroStep, setIsIntroStep] = useState(true) // 시작 단계 상태
    const [questions, setQuestions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [evaluations, setEvaluations] = useState([]) // 답변 평가 데이터를 저장

    const videoRef = useRef(null)

    const generateQuestions = async () => {
        setIsLoading(true)
        setQuestions([])

        try {
            const questionPromises = [
                fetchQuestionFromGPT(),
                fetchQuestionFromGPT(),
                fetchQuestionFromGPT()
            ]

            console.log('Fetching questions...') // 로깅 추가
            const generatedQuestions = await Promise.all(questionPromises)

            console.log('Generated Questions:', generatedQuestions) // 생성된 질문 로깅
            setQuestions(generatedQuestions)
        } catch (error) {
            console.error('질문 생성 실패:', error)
            console.error('Error Details:', error.response?.data || error.message) // 상세 오류 로깅
        } finally {
            setIsLoading(false)
        }
    }

    const startConversation = async () => {
        try {
            await generateQuestions()
            setResponses([])
            setEvaluations([])
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

    const startQuestion = async stepIndex => {
        try {
            const startImage = captureImage() // 질문 시작 시 이미지 캡처
            await sendImageToServer(startImage, stepIndex + 1) // 시작 이미지 전송

            await speak(questions[stepIndex])
            await listen()

            const endImage = captureImage() // 질문 끝날 때 이미지 캡처
            await sendImageToServer(endImage, stepIndex + 1) // 끝 이미지 전송
        } catch (error) {
            console.error('Question error:', error)
        }
    }

    const handleNextQuestion = async () => {
        stopRecognition()

        if (currentAnswer) {
            const question = questions[currentStep]
            const evaluation = await analyzeAnswerWithGPT(question, currentAnswer)
            setResponses(prev => [
                ...prev,
                {
                    question: questions[currentStep],
                    answer: currentAnswer
                }
            ])
            setEvaluations(prev => [...prev, evaluation])
            setCurrentAnswer(null)
        }

        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1)
            await startQuestion(currentStep + 1)
        } else {
            updateStatus('모든 대화가 완료되었습니다.', 'success')
            setIsFinished(true)
            setIsStarted(false)
        }
    }

    const startCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setErrorMsg('이 브라우저는 카메라를 지원하지 않습니다.')
            console.error('mediaDevices 또는 getUserMedia가 지원되지 않습니다.')
            return
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setErrorMsg('')
            }
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                setErrorMsg('카메라 접근이 허용되지 않았습니다.')
            } else if (error.name === 'NotFoundError') {
                setErrorMsg('사용 가능한 카메라가 없습니다.')
            } else {
                setErrorMsg('카메라 접근 중 문제가 발생했습니다.')
            }
            console.error('카메라 에러:', error)
        }
    }

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
            videoRef.current.srcObject = null
        }
    }

    useEffect(() => {
        if (!isIntroStep) {
            startCamera()
        }
        return () => {
            stopCamera()
        }
    }, [isIntroStep])

    useEffect(() => {
        if (isFinished) {
            stopCamera()
        }
    }, [isFinished])

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

    const captureImage = () => {
        if (!videoRef.current) return null

        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight

        const context = canvas.getContext('2d')
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

        return canvas.toDataURL('image/jpeg') // Base64로 변환
    }

    const sendImageToServer = async (image, count) => {
        try {
            const userId = localStorage.getItem('userId') // 로컬스토리지에서 userId 가져오기
            const url = `${import.meta.env.VITE_API_URL}/analyze`

            const response = await fetchData({
                url,
                method: 'POST',
                body: {
                    image,
                    count: 1, // 항상 1로 고정
                    userId
                }
            })

            console.log('Server response:', response)
        } catch (error) {
            console.error('Error sending image to server:', error)
        }
    }

    if (isIntroStep) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center px-4">
                {' '}
                {/* 양쪽 패딩 추가 */}
                <h1 className="text-2xl font-bold mb-8 text-gray-800">포근이와 대화하기</h1>
                <img
                    src={IntroImage} // 적절한 이미지 경로로 대체하세요.
                    alt="인지능력 테스트"
                    className="w-[300px] h-[300px] mb-8"
                />
                <button
                    onClick={() => setIsIntroStep(false)}
                    className="w-full max-w-3xl bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    시작하기
                </button>
            </div>
        )
    }

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
                            <p>
                                <strong>평가:</strong> {evaluations[index]?.적절성 || '분석 중'}
                            </p>
                            <p>
                                <strong>이유:</strong> {evaluations[index]?.이유 || '분석 중'}
                            </p>
                        </div>
                    ))}
                    <button
                        onClick={() => navigate('/mypage')} // /mypage로 이동
                        className="w-full py-3 mt-6 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
                        더 자세한 결과 보기
                    </button>
                    <button
                        onClick={startConversation}
                        className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        다시 시작하기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Progress bar */}
            <div className="w-full max-w-3xl bg-gray-200 h-2 mt-4 mx-auto rounded">
                <div
                    className="bg-blue-600 h-2 rounded transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
            </div>

            {/* 상단으로 올린 섹션 */}
            <div className="flex flex-col justify-start items-center flex-grow pt-4 px-4">
                <p className="text-center text-black text-base mb-3">{questions[currentStep]}</p>
                {/* 상태 메시지 */}
                <div
                    className={`text-center p-4 rounded w-full max-w-3xl ${
                        status.type === 'error'
                            ? 'bg-red-100 text-red-600'
                            : status.type === 'success'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-800'
                    }`}>
                    {status.message}
                </div>

                {/* 질문과 버튼 */}
                <div className="w-full max-w-3xl p-4 bg-white rounded-lg">
                    {/* 질문과 단계 표시 */}
                    <div className="flex justify-between items-center pb-2 mb-2">
                        <h1 className="text-lg font-bold">음성 대화 테스트</h1>
                        <div className="text-sm">
                            {currentStep + 1} / {questions.length}
                        </div>
                    </div>

                    {/* 대화 시작 버튼 */}
                    {!isStarted ? (
                        <button
                            onClick={startConversation}
                            className="w-full py-2 mb-3 bg-black text-white rounded-lg hover:opacity-90 transition">
                            {isLoading ? '질문 생성 중...' : '대화 시작'}
                        </button>
                    ) : (
                        <>
                            {/* 현재 질문 */}
                            <p className="text-center text-base mb-3">{questions[currentStep]}</p>

                            {/* 다시 답변하기 버튼 */}
                            {!currentAnswer && (
                                <button
                                    onClick={retry}
                                    className="w-full py-2 mb-3 bg-red-600 text-white rounded-lg hover:opacity-90 transition">
                                    다시 답변하기
                                </button>
                            )}

                            {/* 다음 질문 / 결과 버튼 */}
                            <button
                                onClick={handleNextQuestion}
                                className={`w-full py-2 ${
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

                {/* 비디오 영역 */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mt-4 w-full max-w-3xl">
                    {errorMsg && (
                        <div className="absolute inset-0 flex items-center justify-center text-red-500">
                            {errorMsg}
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        className="w-full h-[400px] object-cover transform scale-x-[-1]"
                        autoPlay
                        playsInline
                    />
                </div>
            </div>
        </div>
    )
}

export default VoiceChat
