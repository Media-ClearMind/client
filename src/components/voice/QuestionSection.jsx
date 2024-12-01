import { analyzeAnswerWithGPT, fetchQuestionFromGPT } from '@/lib/api/gpt'
import { useEffect, useState } from 'react'

import { captureImage } from '@/lib/utils/camera'

const QuestionSection = ({
    videoRef,
    isStarted,
    questions,
    setQuestions,
    responses,
    setResponses,
    evaluations,
    setEvaluations,
    setIsFinished
}) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleNextQuestion = async () => {
        const question = questions[currentStep]
        const evaluation = await analyzeAnswerWithGPT(question, currentAnswer)
        setResponses(prev => [...prev, { question, answer: currentAnswer }])
        setEvaluations(prev => [...prev, evaluation])

        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }

    useEffect(() => {
        if (!isStarted) {
            setIsLoading(true)
            Promise.all([fetchQuestionFromGPT(), fetchQuestionFromGPT(), fetchQuestionFromGPT()])
                .then(setQuestions)
                .finally(() => setIsLoading(false))
        }
    }, [isStarted])

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="flex-grow flex flex-col justify-center items-center">
                <p>{questions[currentStep]}</p>
                <video
                    ref={videoRef}
                    className="w-full h-[400px]"
                    autoPlay
                />
                <button onClick={handleNextQuestion}>다음 질문으로</button>
            </div>
        </div>
    )
}

export default QuestionSection
