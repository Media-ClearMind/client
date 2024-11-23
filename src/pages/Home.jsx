import 'moment/locale/ko'

import React, { useEffect, useRef, useState } from 'react'

import { Link } from 'react-router-dom'
import moment from 'moment'

moment.locale('ko')

const HomePage = ({ user = { displayName: '익명' } }) => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [progress, setProgress] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)
    const weekContainerRef = useRef(null)

    const handleProgressUpdate = newProgress => {
        setProgress(newProgress)
    }

    const handleCompletionStatusChange = status => {
        setIsCompleted(status)
    }

    const todayDate = moment().format('YYYY-MM-DD')
    const selectedFormattedDate = moment(selectedDate).format('YYYY-MM-DD')
    const currentMonth = moment(selectedDate).format('MMMM YYYY')

    // Calendar date range calculation
    const startOfRange = moment(selectedDate).subtract(365, 'days')
    const endOfRange = moment(selectedDate).add(365, 'days')
    const totalDays = endOfRange.diff(startOfRange, 'days') + 1
    const dateRange = Array.from({ length: totalDays }, (_, i) =>
        startOfRange.clone().add(i, 'days')
    )

    useEffect(() => {
        if (weekContainerRef.current) {
            const todayIndex = dateRange.findIndex(day => day.isSame(new Date(), 'day'))
            const containerWidth = weekContainerRef.current.offsetWidth
            const scrollPosition = todayIndex * 60 - (containerWidth / 2 - 30)
            weekContainerRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            })
        }
    }, [dateRange])

    const handlePrevMonth = () => {
        setSelectedDate(moment(selectedDate).subtract(1, 'month').toDate())
    }

    const handleNextMonth = () => {
        setSelectedDate(moment(selectedDate).add(1, 'month').toDate())
    }

    const handleDayClick = day => {
        setSelectedDate(day.toDate())
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-black">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-6">
                <div className="text-2xl font-bold text-blue-600">Logo</div>
                <Link
                    to="/start"
                    className="text-blue-600 hover:text-blue-700">
                    Start
                </Link>
            </header>

            {/* Top Container */}
            <div className="px-8 py-4 text-center">
                <div className="space-y-2">
                    <h1 className="text-xl font-bold text-left">
                        안녕하세요, {user.displayName}님
                    </h1>
                    <h2 className="text-xl font-bold text-left">오늘도 목표를 달성해보세요!</h2>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Bottom Container */}
            <div className="flex-1 bg-white rounded-t-3xl px-4 py-8">
                {/* Calendar */}
                <div className="mb-8">
                    {/* Calendar Header */}
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-gray-100 rounded-full">
                            ←
                        </button>
                        <span className="text-lg font-bold">{currentMonth}</span>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-full">
                            →
                        </button>
                    </div>

                    {/* Calendar Days */}
                    <div
                        ref={weekContainerRef}
                        className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
                        {dateRange.map(day => (
                            <div
                                key={day.format('YYYY-MM-DD')}
                                onClick={() => handleDayClick(day)}
                                className="flex flex-col items-center min-w-[50px] cursor-pointer">
                                <span className="font-semibold text-sm mb-1">
                                    {day.format('ddd')}
                                </span>
                                <div
                                    className={`
                    w-8 h-8 flex items-center justify-center rounded-full
                    ${day.isSame(selectedDate, 'day') ? 'bg-blue-600 text-white' : ''}
                    ${
                        day.isSame(new Date(), 'day') && !day.isSame(selectedDate, 'day')
                            ? 'border-2 border-blue-600'
                            : ''
                    }
                  `}>
                                    {day.format('DD')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Completion Popup */}
                {isCompleted && selectedFormattedDate === todayDate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-4">목표 달성!</h3>
                            <p>축하합니다! 오늘의 목표를 달성하셨습니다.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage
