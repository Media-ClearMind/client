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
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const StatisticalGraph = () => {
    const [period, setPeriod] = useState('day')
    const [filteredData, setFilteredData] = useState([])
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

        const emotionScore = Object.entries(item.analysis_average.emotion).reduce(
            (score, [emotion, value]) => {
                const weight = emotionWeights[emotion] || 0
                return score + weight * value
            },
            0
        )

        const normalizedEmotionScore = Math.max(0, Math.min(100, 50 + emotionScore))

        return Math.round(normalizedEmotionScore * 0.5 + item.interview_data.mean_score * 0.5)
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
                interview_count: group.items[0]?.interview_count
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')

            // API 요청
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/result`, {
                headers: {
                    Authorization: `Bearer ${token}` // 인증 헤더
                }
            })

            // 서버 응답 처리
            const rawData = response.data.data
            const processed = processDataByPeriod(rawData, period)
            setFilteredData(processed)
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
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

    const handleClick = interview_count => {
        navigate(`/detail/${interview_count}`)
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
                                    const interview_count = clickedData?.interview_count
                                    if (interview_count) {
                                        handleClick(interview_count)
                                    }
                                }
                            }}
                            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={value => {
                                    const date = new Date(value)
                                    const month = String(date.getMonth() + 1).padStart(2, '0')
                                    const day = String(date.getDate()).padStart(2, '0')
                                    return `${month}-${day}`
                                }}
                                height={50}
                                tick={{ fontSize: 12, fill: '#666' }}
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
