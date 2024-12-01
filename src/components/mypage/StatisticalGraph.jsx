import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import { useEffect, useState } from 'react'

import { data } from './data'
import { useNavigate } from 'react-router-dom'

const StatisticalGraph = () => {
    const [period, setPeriod] = useState('day')
    const [filteredData, setFilteredData] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const calculateTotalScore = item => {
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

        return Math.round(
            normalizedEmotionScore * 0.5 + item.face_confidence_avg * 0.2 + item.answer_score * 0.3
        )
    }

    const processDataByPeriod = (data, periodType) => {
        const currentDate = new Date()
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1)

        const groupedData = {}

        const filteredData = data.filter(item => {
            const itemDate = new Date(item.date)
            if (periodType === 'day') {
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(currentDate.getDate() - 30)
                return itemDate >= thirtyDaysAgo
            } else if (periodType === 'week' || periodType === 'month') {
                const startDate =
                    periodType === 'week'
                        ? new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                        : oneYearAgo
                return itemDate >= startDate
            }
            return true
        })

        filteredData.forEach(item => {
            const itemDate = new Date(item.date)
            let key

            if (periodType === 'day') {
                key = item.date
            } else if (periodType === 'week') {
                const weekStart = new Date(itemDate)
                weekStart.setDate(itemDate.getDate() - itemDate.getDay())
                key = weekStart.toISOString().split('T')[0]
            } else if (periodType === 'month') {
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

        return Object.values(groupedData)
            .map(group => ({
                date: group.date,
                totalScore: Math.round(
                    group.totalScores.reduce((sum, score) => sum + score, 0) /
                        group.totalScores.length
                ),
                itemCount: group.items.length,
                analysis_id: group.items[0]?.analysis_id
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded shadow-lg">
                    <p className="text-sm text-gray-600">{`날짜: ${label}`}</p>
                    <p className="text-sm font-bold text-blue-600">{`점수: ${payload[0].value}`}</p>
                </div>
            )
        }
        return null
    }

    const handleClick = analysisID => {
        navigate(`/detail/${analysisID}`)
    }

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-600">로딩 중...</div>
            </div>
        )

    return (
        <div className="p-1">
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

            <div className="w-full h-[400px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%">
                    {filteredData.length > 0 ? (
                        <LineChart
                            data={filteredData}
                            onClick={e => {
                                if (e?.activePayload?.[0]?.payload) {
                                    const clickedData = e.activePayload[0].payload
                                    const analysisId = clickedData?.analysis_id
                                    if (analysisId) {
                                        handleClick(analysisId)
                                    }
                                }
                            }}
                            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={value => {
                                    // 날짜 형식을 'MM-DD'로 변경
                                    const date = new Date(value)
                                    const month = String(date.getMonth() + 1).padStart(2, '0')
                                    const day = String(date.getDate()).padStart(2, '0')
                                    return `${month}-${day}`
                                }}
                                height={50} // X축 높이 조정
                                tick={{ fontSize: 12, fill: '#666' }} // 텍스트 스타일 추가
                            />
                            <YAxis
                                domain={[0, 100]}
                                label={{
                                    value: '점수',
                                    angle: -90,
                                    position: 'insideLeft',
                                    offset: 10
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="totalScore"
                                stroke="#8884d8"
                                name="평균 점수"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">이 기간에 사용할 데이터가 없습니다.</p>
                        </div>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default StatisticalGraph
