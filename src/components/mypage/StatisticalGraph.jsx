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
import { data } from './data'

const StatisticalGraph = () => {
    const [period, setPeriod] = useState('day')
    const [filteredData, setFilteredData] = useState('')
    const [dominantEmotion, setDominantEmotion] = useState('')
    const navigate = useNavigate()

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

    const calculateTotalScore = item => {
        // 감정 점수 계산
        const emotionWeights = {
            angry: -0.2,
            disgust: -0.1,
            fear: -0.3,
            happy: 0.2,
            neutral: 0.1,
            sad: -0.4,
            surprise: 0
        }

        const emotionScore = Object.entries(item.emotion_avg).reduce((score, [emotion, value]) => {
            const weight = emotionWeights[emotion] || 0
            return score + weight * value
        }, 0)

        const normalizedEmotionScore = Math.max(0, Math.min(100, 50 + emotionScore))

        // 총점 계산 (감정 50%, 얼굴 인식 신뢰도 20%, 답변 점수 30%)
        return Math.round(
            normalizedEmotionScore * 0.5 + item.face_confidence_avg * 0.2 + item.answer_score * 0.3
        )
    }

    const processDataByPeriod = (data, periodType) => {
        const currentDate = new Date()
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1)

        // 필터링된 데이터를 저장할 객체
        const groupedData = {}

        // 기간에 따른 데이터 필터링
        const filteredData = data.filter(item => {
            const itemDate = new Date(item.date)
            if (periodType === 'day') {
                // 최근 30일
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(currentDate.getDate() - 30)
                return itemDate >= thirtyDaysAgo
            } else if (periodType === 'week' || periodType === 'month') {
                // 주 단위는 한 달, 월 단위는 1년
                const startDate =
                    periodType === 'week'
                        ? new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                        : oneYearAgo
                return itemDate >= startDate
            }
            return true
        })

        // 기간별 데이터 그룹핑 및 평균 계산
        filteredData.forEach(item => {
            const itemDate = new Date(item.date)
            let key

            if (periodType === 'day') {
                // 일별 데이터는 그대로 사용
                key = item.date
            } else if (periodType === 'week') {
                // 주별 데이터 그룹핑
                const weekStart = new Date(itemDate)
                weekStart.setDate(itemDate.getDate() - itemDate.getDay())
                key = weekStart.toISOString().split('T')[0]
            } else if (periodType === 'month') {
                // 월별 데이터 그룹핑
                key = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`
            }

            if (!groupedData[key]) {
                groupedData[key] = {
                    date: key,
                    totalScores: [],
                    items: []
                }
            }

            const totalScore = calculateTotalScore(item)
            groupedData[key].totalScores.push(totalScore)
            groupedData[key].items.push(item)
        })

        // 평균 계산 및 최종 데이터 형식으로 변환
        return Object.values(groupedData)
            .map(group => ({
                date: group.date,
                totalScore: Math.round(
                    group.totalScores.reduce((sum, score) => sum + score, 0) /
                        group.totalScores.length
                ),
                itemCount: group.items.length
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    useEffect(() => {
        const processed = processDataByPeriod(data, period)
        setFilteredData(processed)
    }, [period])

    const handleChangePeriod = newPeriod => {
        setPeriod(newPeriod)
    }

    const handleClick = data => {
        navigate(`/detail/${data.analysis_id}`)
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center text-black mb-6">통계 시각화 그래프</h1>

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
                {filteredData.length > 0 ? (
                    <LineChart
                        data={filteredData}
                        onClick={handleClick}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            tickFormatter={value => {
                                if (period === 'month') {
                                    const [year, month] = value.split('-')
                                    return `${month}/${year}`
                                }
                                return value
                            }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            label={{
                                value: 'Score',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10
                            }}
                        />
                        {/* <Tooltip content={<CustomTooltip />} /> */}
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="totalScore"
                            stroke="#8884d8"
                            name="Average Score"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No data available for this period.</p>
                    </div>
                )}
            </ResponsiveContainer>
        </div>
    )
}

export default StatisticalGraph
