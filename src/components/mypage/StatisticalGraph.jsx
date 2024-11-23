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
import { data } from './data'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const StatisticalGraph = () => {
  const [period, setPeriod] = useState('day') // 필터 상태 관리
  const [filteredData, setFilteredData] = useState([])
  const [analysisHistory, setAnalysisHistory] = useState([])
  const navigate = useNavigate()
  const { user_id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`api/analysis/user/${user_id}/history/period`)
        setAnalysisHistory(response.data.analysis_history)
        setPeriod(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [user_id])

  const filterData = (data, period) => {
    const today = new Date('2024-10-15')

    return data.filter(item => {
      const date = parse(item.date, 'yyyy-MM-dd', new Date())
      if (isNaN(date)) {
        console.log(`Invalid date: ${item.date}`)
        return false
      }

      let startDate, endDate

      if (period === 'week') {
        startDate = startOfWeek(today)
        endDate = endOfWeek(today)
        console.log(`Week range: ${startDate} - ${endDate}`)
        return isWithinInterval(date, { start: startDate, end: endDate })
      } else if (period === 'month') {
        startDate = startOfMonth(today)
        endDate = endOfMonth(today)
        console.log(`Month range: ${startDate} - ${endDate}`)
        return isWithinInterval(date, { start: startDate, end: endDate })
      }

      return true
    })
  }

  useEffect(() => {
    const result = filterData(data, period)
    console.log(`Filtered data for ${period}:`, result)
    setFilteredData(result)
  }, [period])

  const handleChangePeriod = newPeriod => {
    setPeriod(newPeriod)
  }

  // 클릭한 날짜에 맞는 분석 ID를 받아서 detail 페이지로 이동
  const handleClick = date => {
    const selectedAnalysis = analysisHistory.find(item => {
      return (
        parse(item.date, 'yyyy-MM-dd', new Date()).toLocaleDateString() ===
        date.toLocaleDateString()
      )
    })
    if (selectedAnalysis) {
      navigate(`/detail/${selectedAnalysis.analysis_id}`) // 해당 analysis_id로 이동
    }
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
          <div className="text-center py-20 text-gray-500">해당 기간에 데이터가 없습니다.</div>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default StatisticalGraph
