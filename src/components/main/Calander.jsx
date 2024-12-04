import { BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs'
import React, { useEffect, useState } from 'react'

import Analysis from '@/lib/api/analysis'
import cn from '@/utils/formatter/cn'

const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월'
]

// 히트맵 색상 매핑 함수
const getScoreLevel = meanScore => {
    if (meanScore >= 90) return 4 // 최고 점수
    if (meanScore >= 70) return 3
    if (meanScore >= 50) return 2
    if (meanScore > 0) return 1
    return 0 // 점수 없음
}

const getHeatmapColor = achieved => {
    switch (achieved) {
        case 1:
            return 'bg-blue-100'
        case 2:
            return 'bg-blue-200'
        case 3:
            return 'bg-blue-400'
        case 4:
            return 'bg-blue-600'
        default:
            return 'bg-white'
    }
}

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date()) // 현재 날짜
    const [dayAchieveMap, setDayAchieveMap] = useState(new Map()) // 날짜별 데이터 맵핑
    const [loading, setLoading] = useState(false)

    // 달력 생성 함수
    const generateCalendar = date => {
        const year = date.getFullYear()
        const month = date.getMonth()

        const firstDayOfMonth = new Date(year, month, 1)
        const lastDayOfMonth = new Date(year, month + 1, 0)

        const startDay = firstDayOfMonth.getDay()
        const totalDays = lastDayOfMonth.getDate()

        const days = []

        // 이전 달의 빈 칸 채우기
        for (let i = 0; i < startDay; i++) {
            days.push(null)
        }

        // 해당 월의 일수 채우기
        for (let day = 1; day <= totalDays; day++) {
            days.push(day)
        }

        return days
    }

    const calendarDays = generateCalendar(currentDate)

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    // 날짜별 데이터를 API로 가져오는 함수
    const fetchAnalysisData = async () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        // 현재 달의 첫째 날
        const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`

        // 현재 달의 마지막 날 계산
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
        const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`

        setLoading(true)
        try {
            const response = await Analysis.getAnalysisHistory({ startDate, endDate })
            const dayMap = new Map()

            // 데이터를 날짜별로 매핑
            response.data?.forEach(result => {
                const date = result.date // 날짜
                const meanScore = result.interview_data.mean_score // 평균 점수
                const achievedLevel = getScoreLevel(meanScore) // 점수 기반 색상 레벨 결정
                dayMap.set(date, achievedLevel)
            })

            setDayAchieveMap(dayMap)
        } catch (error) {
            console.error('데이터 로드 실패:', error)
        } finally {
            setLoading(false)
        }
    }

    // 날짜 변경 시 데이터 로드
    useEffect(() => {
        fetchAnalysisData()
    }, [currentDate])

    return (
        <div className="w-full bg-white rounded-lg p-4">
            {/* 로딩 상태 */}
            {loading && <p className="text-center text-gray-500">로딩 중...</p>}

            {/* 달력 헤더 */}
            <div className="flex justify-center items-center mb-4 gap-5">
                <button
                    onClick={handlePreviousMonth}
                    className="text-gray-300 hover:text-gray-700"
                    aria-label="이전 달">
                    <BsCaretLeftFill className="w-8 h-8" />
                </button>

                <h2 className="text-xl font-semibold">
                    {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                </h2>

                <button
                    onClick={handleNextMonth}
                    className="text-gray-300 hover:text-gray-700"
                    aria-label="다음 달">
                    <BsCaretRightFill className="w-8 h-8" />
                </button>
            </div>

            {/* 요일 표시 */}
            <div className="grid grid-cols-7 gap-2 mb-2 font-semibold">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <span
                        key={day}
                        className="text-sm md:text-base text-center text-black">
                        {day}
                    </span>
                ))}
            </div>

            {/* 날짜 표시 */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                    const year = currentDate.getFullYear()
                    const month = currentDate.getMonth() + 1
                    const dayString = day
                        ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        : null
                    const achieved =
                        dayString && dayAchieveMap.has(dayString) ? dayAchieveMap.get(dayString) : 0

                    return (
                        <div
                            key={index}
                            className={cn(
                                'relative flex items-center justify-center text-lg md:text-xl',
                                'h-[40px] w-[40px]',
                                'text-center text-black rounded-full transition-colors',
                                `${day === null ? 'opacity-50' : 'cursor-pointer'}`,
                                `${day ? getHeatmapColor(achieved || 0) : ''}`
                            )}>
                            {day}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Calendar
