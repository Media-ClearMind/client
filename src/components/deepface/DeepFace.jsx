import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import axios from 'axios'

const DeepFace = () => {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [isRecording, setIsRecording] = useState(false)
    const [emotionData, setEmotionData] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const analyzeIntervalRef = useRef(null)

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsRecording(true)
                setErrorMsg('')
            }
        } catch (error) {
            setErrorMsg('카메라 접근 권한이 필요합니다.')
            console.log('카메라 에러:', error)
        }
    }

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
            videoRef.current.srcObject = null
            setIsRecording(false)
        }
    }

    const captureAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current || isAnalyzing) return

        try {
            setIsAnalyzing(true)

            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            canvas.width = videoRef.current.videoWidth
            canvas.height = videoRef.current.videoHeight
            context.drawImage(videoRef.current, 0, 0)

            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/jpeg')
            })

            const formData = new FormData()
            formData.append('image', blob, 'capture.jpg')

            const response = await axios.post('/api/', {
                'Content-Type': 'multipart/form-data'
            })

            if (!response.ok) {
                throw new Error('서버 응답 에러')
            }

            const result = await response.json()
            setEmotionData(result)
            setErrorMsg('')
        } catch (error) {
            console.error('분석 에러:', error)
            setErrorMsg('감정 분석 중 오류가 발생했습니다.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    useEffect(() => {
        if (isRecording) {
            analyzeIntervalRef.current = setInterval(captureAndAnalyze, 3000)
        } else {
            if (analyzeIntervalRef.current) {
                clearInterval(analyzeIntervalRef.current)
            }
        }

        return () => {
            if (analyzeIntervalRef.current) {
                clearInterval(analyzeIntervalRef.current)
            }
        }
    }, [isRecording])

    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [])

    const getEmotionColor = emotion => {
        const colors = {
            angry: '#ff4d4d',
            disgust: '#4dc3ff',
            fear: '#bf4040',
            happy: '#ffdb4d',
            sad: '#668cff',
            surprise: '#ff99ff',
            neutral: '#8cff66'
        }
        return colors[emotion.toLowerCase()] || '#gray'
    }

    return (
        <div className="p-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">실시간 감정 분석</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={isRecording ? stopCamera : startCamera}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                isRecording
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}>
                            <Camera className="w-5 h-5" />
                            {isRecording ? '중지' : '시작'}
                        </button>
                        {isRecording && (
                            <>
                                <button
                                    onClick={captureAndAnalyze}
                                    disabled={isAnalyzing}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50">
                                    {isAnalyzing ? '분석중...' : '분석하기'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative minHeight: '600px' bg-gray-100 rounded-lg overflow-hidden">
                        {errorMsg && (
                            <div className="absolute inset-0 flex items-center justify-center text-red-500">
                                {errorMsg}
                            </div>
                        )}
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover transform scale-x-[-1]"
                            autoPlay
                            playsInline
                        />
                        <canvas
                            ref={canvasRef}
                            className="hidden"
                        />
                    </div>

                    {emotionData && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-xl font-semibold mb-4">
                                감정 분석 결과
                                {emotionData.dominant && (
                                    <span
                                        className="ml-2 px-3 py-1 rounded-full text-sm"
                                        style={{
                                            backgroundColor: getEmotionColor(emotionData.dominant)
                                        }}>
                                        {emotionData.dominant}
                                    </span>
                                )}
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DeepFace
