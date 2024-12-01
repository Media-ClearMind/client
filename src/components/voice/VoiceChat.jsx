import { startCamera, stopCamera } from '@/lib/utils/camera'
import { useEffect, useRef, useState } from 'react'

import IntroSection from './IntroSection'
import QuestionSection from './QuestionSection'
import ResultsSection from './ResultsSection'
import { useNavigate } from 'react-router-dom'

const VoiceChat = () => {
    const navigate = useNavigate()
    const videoRef = useRef(null)

    const [isIntroStep, setIsIntroStep] = useState(true)
    const [isStarted, setIsStarted] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [questions, setQuestions] = useState([])
    const [responses, setResponses] = useState([])
    const [evaluations, setEvaluations] = useState([])

    const handleStart = () => {
        setIsIntroStep(false)
    }

    useEffect(() => {
        if (!isIntroStep && !isFinished) {
            startCamera(videoRef)
        }
        return () => stopCamera(videoRef)
    }, [isIntroStep, isFinished])

    if (isIntroStep) {
        return <IntroSection onStart={handleStart} />
    }

    if (isFinished) {
        return (
            <ResultsSection
                responses={responses}
                evaluations={evaluations}
                onRestart={() => {
                    setIsFinished(false)
                    setIsIntroStep(true)
                }}
                onNavigate={() => navigate('/mypage')}
            />
        )
    }

    return (
        <QuestionSection
            videoRef={videoRef}
            isStarted={isStarted}
            questions={questions}
            setQuestions={setQuestions}
            responses={responses}
            setResponses={setResponses}
            evaluations={evaluations}
            setEvaluations={setEvaluations}
            setIsFinished={setIsFinished}
        />
    )
}

export default VoiceChat
