import { useEffect, useState } from 'react'
import { parse, startOfWeek, startOfMonth, isWithinInterval, endOfWeek, endOfMonth } from 'date-fns'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import { useNavigate } from 'react-router-dom'

const StatisticalGraph = () => {
    const [period, setPeriod] = useState('day')
    const [filterData, setFilteredData] = useState('')
    const [dominantEmotion, setDominantEmotion] = useState('')
    const navigate = useNavigate()

    // 더미 데이터 (API 호출을 대신하는 더미 데이터)
    const dummyAnalysisHistory = [
        {
            analysis_id: '12345',
            date: '2024-11-23',
            emotion_avg: {
                angry: 0.15702912211418152,
                disgust: 0.004910706542432308,
                fear: 0.1376156508922577,
                happy: 0.006351242307573557,
                neutral: 64.16819763183594,
                sad: 35.5252571105957,
                surprise: 0.000641261984128505
            },
            face_confidence_avg: 90,
            answer_score: 40
        }
    ]

    const inputData = [
        {
            analysis_id: '12345',
            date: '2024-11-23',
            face_confidence: 0.91,
            emotion: {
                angry: 0.157,
                disgust: 0.0049,
                fear: 0.137,
                happy: 0.0063,
                neutral: 64.168,
                sad: 35.525,
                surprise: 0.0006
            },
            voice_analysis: {
                answer_score: 43
            }
        },
        {
            analysis_id: '12346',
            date: '2024-11-23',
            face_confidence: 0.9,
            emotion: {
                angry: 10,
                disgust: 20,
                fear: 30,
                happy: 10,
                neutral: 10,
                sad: 20,
                surprise: 5
            },
            dominant_emotion: 'fear',
            voice_analysis: {
                answer_score: 55
            }
        }
    ]

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

    //deepface 결과와 voice의 결과에 따른 각각의 점수를 매긴 뒤 총점 계산
    const calculateEmotionScore = emotion_avg => {
        const emotionWeights = {
            angry: -0.2,
            disgust: -0.1,
            fear: -0.3,
            happy: 0.2,
            neutral: 0.1,
            sad: -0.4,
            surprise: 0
        }

        const totalEmotionScore = Object.entries(emotion_avg).reduce((score, [emotion, value]) => {
            const weight = emotionWeights[emotion] || 0
            return score + weight * value
        }, 0)

        // 감정 점수를 0~100으로 정규화
        return Math.max(0, Math.min(100, 100 + totalEmotionScore / 10))
    }

    const calculateTotalScore = data => {
        const emotion_score = calculateEmotionScore(data.emotion)
        const confidence_score = Math.min(100, data.face_confidence * 100) // 0~1을 0~100으로 변환
        const answer_score = Math.min(100, data.voice_analysis.answer_score) // 이미 0~100

        // 가중치 합산
        const totalScore =
            emotion_score * 0.5 + // 감정 분석: 50%
            confidence_score * 0.2 + // 얼굴 신뢰도: 20%
            answer_score * 0.3 // 설문 점수: 30%

        return Math.round(totalScore) // 소수점 반올림
    }

    const calculateFinalScoreForDate = dataList => {
        if (!dataList || dataList.length === 0) return 0

        // 같은 날짜의 데이터를 필터링
        const scores = dataList.map(data => calculateTotalScore(data))
        const finalScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

        return Math.round(finalScore)
    }

    const finalScore = calculateFinalScoreForDate(inputData)

    const filterData = (data, period) => {
        const today = new Date('2024-11-23')
        return data.filter(item => {
            const date = parse(item.date, 'yyyy-MM-dd', new Date())
            if (isNaN(date)) return false

            let startDate, endDate
            if (period === 'week') {
                startDate = startOfWeek(today)
                endDate = endOfWeek(today)
                return isWithinInterval(date, { start: startDate, end: endDate })
            } else if (period === 'month') {
                startDate = startOfMonth(today)
                endDate = endOfMonth(today)
                return isWithinInterval(date, { start: startDate, end: endDate })
            }
            return true
        })
    }

    useEffect(() => {
        const result = filterData(dummyAnalysisHistory, period)
        setFilteredData(result)
    }, [period])

    const handleChangePeriod = newPeriod => {
        setPeriod(newPeriod)
    }

    const handleClick = data => {
        navigate(`/detail/${data.analysis_id}`)
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">통계 시각화 그래프</h1>

            {/* 필터 버튼 */}
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-md ${
                        period === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleChangePeriod('day')}>
                    일
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${
                        period === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleChangePeriod('week')}>
                    주
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${
                        period === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleChangePeriod('month')}>
                    월
                </button>
            </div>

            {/* 그래프 */}
            <ResponsiveContainer
                width="100%"
                height={400}>
                {finalScore.length > 0 ? (
                    <LineChart data={finalScore}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            onClick={handleClick}
                        />
                    </LineChart>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        해당 기간에 데이터가 없습니다.
                    </div>
                )}
            </ResponsiveContainer>
        </div>
    )
}

export default StatisticalGraph
