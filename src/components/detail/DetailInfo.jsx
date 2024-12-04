import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'
import { useEffect, useState } from 'react'

import LoadingPage from '@/pages/Loading'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const DetailInfo = () => {
    const { count } = useParams()
    const [loading, setLoading] = useState(true)
    const [analysisData, setAnalysisData] = useState(null)
    const [dominantEmotion, setDominantEmotion] = useState('')
    const [stressLevel, setStressLevel] = useState(0)
    const [emotionalState, setEmotionalState] = useState('')

    const handleDominantEmotion = emotionData => {
        if (!emotionData || Object.keys(emotionData).length === 0) return

        const maxEmotion = Object.entries(emotionData).reduce(
            (max, [emotion, value]) => (value > max.value ? { emotion, value } : max),
            { emotion: '', value: -Infinity }
        )

        setDominantEmotion(maxEmotion.emotion)
    }

    const calculateStressLevel = emotionData => {
        const stressWeights = {
            angry: 0.8,
            fear: 0.7,
            sad: 0.6,
            disgust: 0.5,
            surprise: 0.3,
            happy: -0.5,
            neutral: 0.1
        }

        const weightedSum = Object.entries(emotionData).reduce(
            (sum, [emotion, value]) => sum + value * (stressWeights[emotion] || 0),
            0
        )

        const totalEmotionValue = Object.values(emotionData).reduce((sum, value) => sum + value, 0)

        const stressLevel = (weightedSum / totalEmotionValue) * 100

        return Math.min(100, Math.max(0, stressLevel))
    }

    const calculateTotalScore = (emotionData, meanScore) => {
        const emotionWeights = {
            angry: -0.2,
            disgust: -0.1,
            fear: -0.3,
            happy: 0.2,
            neutral: 0.1,
            sad: -0.4,
            surprise: 0
        }

        // 감정 점수 계산
        const emotionScore = Object.entries(emotionData).reduce((score, [emotion, value]) => {
            const weight = emotionWeights[emotion] || 0
            return score + weight * value
        }, 0)

        // 감정 점수를 0~100 범위로 정규화
        const normalizedEmotionScore = Math.max(0, Math.min(100, 50 + emotionScore))

        // 평균 점수 계산: 얼굴 감정 점수 50% + 면접 점수 50%
        const totalScore = normalizedEmotionScore * 0.5 + meanScore * 0.5

        return Math.round(totalScore)
    }

    const analyzeEmotionalState = emotionData => {
        const positiveEmotions = emotionData.happy
        const negativeEmotions =
            emotionData.sad + emotionData.angry + emotionData.fear + emotionData.disgust
        const neutralEmotion = emotionData.neutral

        if (neutralEmotion > 60) return '감정적으로 안정된 상태'
        if (positiveEmotions > negativeEmotions) return '긍정적인 감정 상태'
        if (negativeEmotions > 70) return '부정적인 감정이 강한 상태'
        if (emotionData.angry > 30) return '분노 조절이 필요한 상태'
        if (emotionData.sad > 30) return '우울감이 감지되는 상태'
        return '복합적인 감정 상태'
    }

    useEffect(() => {
        const fetchAnalysisData = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/result/${count}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const { interview_data, analysis_average, date } = response.data.data

                const totalScore = calculateTotalScore(
                    analysis_average.emotion,
                    interview_data.mean_score
                )

                setAnalysisData({
                    emotion: analysis_average.emotion,
                    face_confidence: analysis_average.face_confidence,
                    mean_score: totalScore, // 수정된 평균 점수 설정
                    date
                })

                const calculatedStress = calculateStressLevel(analysis_average.emotion)
                setStressLevel(calculatedStress.toFixed(1))
                setEmotionalState(analyzeEmotionalState(analysis_average.emotion))
                handleDominantEmotion(analysis_average.emotion)
            } catch (error) {
                console.error('Error fetching analysis data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalysisData()
    }, [count])

    const getStressLevelCategory = level => {
        if (level < 20) return { text: '매우 낮음', color: 'text-green-500' }
        if (level < 40) return { text: '낮음', color: 'text-green-400' }
        if (level < 60) return { text: '보통', color: 'text-yellow-500' }
        if (level < 80) return { text: '높음', color: 'text-orange-500' }
        return { text: '매우 높음', color: 'text-red-500' }
    }

    const stressCategory = getStressLevelCategory(parseFloat(stressLevel))

    const pieData = analysisData?.emotion
        ? Object.entries(analysisData.emotion).map(([emotion, value]) => ({
              name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
              value: parseFloat(value.toFixed(1))
          }))
        : []

    const COLORS = ['#FF6347', '#FFD700', '#98FB98', '#87CEFA', '#FF69B4', '#D2691E', '#8A2BE2']

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        name
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const RADIAN = Math.PI / 180
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return percent > 0.05 ? (
            <text
                x={x}
                y={y}
                fill="black"
                textAnchor="middle"
                dominantBaseline="central">
                {`${name} ${(percent * 100).toFixed(1)}%`}
            </text>
        ) : null
    }

    if (loading) return <LoadingPage />

    return (
        <div className="h-screen w-full ">
            <div className="w-full p-6 relative">
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-3 text-gray-700">감정 분포</h2>
                    <div className="flex justify-center mt-[-50px]">
                        <PieChart
                            width={500}
                            height={400}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={160}
                                innerRadius={100}
                                fill="#8884d8"
                                labelLine={false}
                                label={renderCustomizedLabel}>
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                verticalAlign="bottom"
                                width={350}
                                height={36}
                            />
                        </PieChart>
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 text-gray-700">분석 요약 정보</h2>
                    <div className="space-y-4 text-gray-600">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p>
                                <strong>분석 일자:</strong> {analysisData.date}
                            </p>
                            <p>
                                <strong>평균 응답 점수:</strong> {analysisData.mean_score}
                            </p>
                            <p>
                                <strong>주요 감정 상태:</strong>{' '}
                                <span className="capitalize">{dominantEmotion}</span>
                            </p>
                            <p>
                                <strong>감정 상태 해석:</strong>{' '}
                                <span className="text-blue-600">{emotionalState}</span>
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p>
                                <strong>얼굴 인식 신뢰도:</strong>{' '}
                                <span className="text-blue-600">
                                    {(analysisData.face_confidence * 100).toFixed(1)}%
                                </span>
                            </p>
                            <p>
                                <strong>스트레스 레벨:</strong>{' '}
                                <span className={stressCategory.color}>
                                    {stressLevel}% ({stressCategory.text})
                                </span>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default DetailInfo
