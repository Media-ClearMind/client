import { useEffect, useState } from 'react'

import Calendar from '@/components/main/Calander'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const MaintenanceGoals = () => {
    const [dDay, setDDay] = useState(null)
    const [myGoal, setMyGoal] = useState(null)
    const [dayAchieveMap, setDayAchieveMap] = useState(new Map())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentDate, setCurrentDate] = useState(new Date())

    const navigate = useNavigate()

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                // 더미 데이터 생성
                const dummyResponse = {
                    status: 'OK',
                    data: {
                        dDay: 10, // 목표까지 남은 일 수
                        goal: '매일 운동하기', // 목표
                        dayAchiveList: [
                            { date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), achieved: 3 },
                            { date: dayjs().format('YYYY-MM-DD'), achieved: 4 }, // 오늘
                            { date: dayjs().add(1, 'day').format('YYYY-MM-DD'), achieved: 2 }
                        ]
                    }
                }

                if (dummyResponse.status === 'OK' && dummyResponse.data) {
                    // D-Day 및 목표 업데이트
                    setDDay(dummyResponse.data.dDay)
                    setMyGoal(dummyResponse.data.goal)

                    // 달성도 맵핑
                    const dayAchieveList = dummyResponse.data.dayAchiveList
                    const achieveMap = new Map()
                    dayAchieveList.forEach(item => {
                        achieveMap.set(item.date, item.achieved)
                    })
                    setDayAchieveMap(achieveMap)
                } else {
                    setError(
                        dummyResponse.description || '캘린더 데이터를 불러오는 데 실패했습니다.'
                    )
                }
            } catch (err) {
                console.error('캘린더 데이터를 가져오는 중 오류 발생:', err)
                setError(err.message || '캘린더 데이터를 불러오는 데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchCalendar()
    }, [currentDate])

    useEffect(() => {
        if (error) {
            navigate('?sector=maintenance') // 에러 발생 시 경로 변경
        }
    }, [error, navigate])

    return (
        <div className="max-w-[800px] mx-auto w-full p-4">
            {loading ? (
                <div className="text-center">로딩중...</div>
            ) : error ? (
                <div className="flex items-center justify-center text-black h-[300px]">
                    Empty Data
                </div>
            ) : (
                <>
                    {/* 캘린더 컴포넌트 */}
                    <Calendar
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        dayAchieveMap={dayAchieveMap}
                    />
                </>
            )}
        </div>
    )
}

export default MaintenanceGoals
