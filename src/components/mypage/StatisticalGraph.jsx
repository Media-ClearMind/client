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
    const [filteredData, setFilteredData] = useState([])
    const navigate = useNavigate()

    // 더미 데이터 (API 호출을 대신하는 더미 데이터)
    const dummyAnalysisHistory = [
        {
            analysis_id: '12345',
            date: '2024-11-23T15:38:08.338Z',
            summary: '긍정적인 감정을 나타내었으며 스트레스 수준은 낮았습니다.',
            face_score: 85,
            voice_confidence: 90,
            stress_level: 5
        },
        {
            analysis_id: '12346',
            date: '2024-11-22T12:30:00.000Z',
            summary: '분석 결과 스트레스가 다소 높게 나타났습니다.',
            face_score: 65,
            voice_confidence: 72,
            stress_level: 8
        },
        {
            analysis_id: '12347',
            date: '2024-11-21T08:45:10.000Z',
            summary: '사용자는 안정적인 감정을 유지하며 분석 결과 긍정적이었습니다.',
            face_score: 78,
            voice_confidence: 80,
            stress_level: 4
        }
    ]

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
                {filteredData.length > 0 ? (
                    <LineChart data={filteredData}>
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
