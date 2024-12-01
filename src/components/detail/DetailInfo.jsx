import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const DetailInfo = () => {
    const { analysis_id } = useParams()
    const [loading, setLoading] = useState(true)
    const [analysisData, setAnalysisData] = useState(null)
    const [dominantEmotion, setDominantEmotion] = useState('')
    const [stressLevel, setStressLevel] = useState(0)
    const [emotionalState, setEmotionalState] = useState('')

    const handleDominantEmotion = emotionData => {
        if (!emotionData || Object.keys(emotionData).length === 0) return

        // `emotionData`에서 가장 높은 값을 가진 감정을 찾음
        const maxEmotion = Object.entries(emotionData).reduce(
            (max, [emotion, value]) => (value > max.value ? { emotion, value } : max),
            { emotion: '', value: -Infinity }
        )

        // 상태 업데이트
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

        // 가중치를 적용한 스트레스 점수 계산
        const weightedSum = Object.entries(emotionData).reduce(
            (sum, [emotion, value]) => sum + value * (stressWeights[emotion] || 0),
            0
        )

        // 감정 값 합산 (전체 합계)
        const totalEmotionValue = Object.values(emotionData).reduce((sum, value) => sum + value, 0)

        // 스트레스 비율 계산 (전체 감정 값에 대한 비율로 환산)
        const stressLevel = (weightedSum / totalEmotionValue) * 100

        // 0-100 사이 값으로 정규화
        return Math.min(100, Math.max(0, stressLevel))
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

    // useEffect(() => {
    //     // analysis_id를 기반으로 데이터 찾기
    //     const selectedData = data.find(item => item.analysis_id === analysis_id)
    //     if (selectedData) {
    //         setAnalysisData({
    //             ...selectedData,
    //             emotion: selectedData.emotion_avg, // emotion 데이터로 매핑
    //             face_confidence: selectedData.face_confidence_avg, // 신뢰도 매핑
    //             result: { summary: `Analysis result for ID ${analysis_id}` } // 샘플 요약
    //         })
    //         const calculatedStress = calculateStressLevel(selectedData.emotion_avg)
    //         setStressLevel(calculatedStress.toFixed(1))
    //         setEmotionalState(analyzeEmotionalState(selectedData.emotion_avg))
    //         handleDominantEmotion(selectedData.emotion_avg)
    //     } else {
    //         console.error('Analysis data not found!')
    //     }
    //     setLoading(false)
    // }, [analysis_id])

    useEffect(() => {
        const fetchAnalysisData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/analysis/${analysis_id}`
                ) // API URL
                const data = response.data

                setAnalysisData({
                    ...data,
                    emotion: data.emotion_avg,
                    face_confidence: data.face_confidence_avg,
                    result: { summary: `Analysis result for ID ${analysis_id}` }
                })

                const calculatedStress = calculateStressLevel(data.emotion_avg)
                setStressLevel(calculatedStress.toFixed(1))
                setEmotionalState(analyzeEmotionalState(data.emotion_avg))
                handleDominantEmotion(data.emotion_avg)
            } catch (error) {
                console.error('Error fetching analysis data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalysisData()
    }, [analysis_id])

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
              value: parseFloat((value * 100).toFixed(1)) // 문자열을 숫자로 변환
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

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-600">로딩 중...</div>
            </div>
        )

    return (
        <div className="h-screen overflow-y-auto bg-gray-100">
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md relative">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 sticky top-0 bg-white z-10 py-4 border-b">
                    분석 디테일 페이지
                </h1>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 text-gray-700">감정 분포</h2>
                    <div className="flex justify-center">
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
                                    {analysisData.face_confidence.toFixed(1)}%
                                </span>
                            </p>
                            <p>
                                <strong>스트레스 레벨:</strong>{' '}
                                <span className={stressCategory.color}>
                                    {stressLevel}% ({stressCategory.text})
                                </span>
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold mb-2">스트레스 관리 권장사항:</p>
                            <p className="text-sm">
                                {parseFloat(stressLevel) > 60
                                    ? '현재 스트레스 수준이 높습니다. 전문가와의 상담을 고려해보세요.'
                                    : parseFloat(stressLevel) > 40
                                      ? '적절한 휴식과 스트레스 관리가 필요합니다.'
                                      : '현재 스트레스 수준이 양호합니다. 현재의 상태를 유지하세요.'}
                            </p>
                        </div>

                        {/* <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold">종합 분석:</p>
                        </div> */}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default DetailInfo
