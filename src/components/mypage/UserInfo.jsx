import React, { useEffect, useState } from 'react'

import Auth from '@/lib/api/auth'

const UserInfo = () => {
    const [userinfo, setUserInfo] = useState(null) // 사용자 정보를 저장할 상태
    const [isLoading, setIsLoading] = useState(true) // 로딩 상태
    const [error, setError] = useState(null) // 에러 상태

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setIsLoading(true) // 로딩 시작
                const data = await Auth.getUserProfile() // 사용자 프로필 API 호출
                setUserInfo(data) // 사용자 정보 저장
            } catch (err) {
                setError('사용자 정보를 가져오는 데 실패했습니다.') // 에러 메시지 설정
                console.error(err)
            } finally {
                setIsLoading(false) // 로딩 종료
            }
        }
        fetchUserInfo()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold text-gray-600 animate-pulse">로딩 중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold text-red-600">{error}</div>
            </div>
        )
    }

    if (!userinfo) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold text-gray-500">사용자 정보가 없습니다.</div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">내 프로필</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <p className="text-gray-500 text-sm">이름</p>
                    <p className="text-lg font-medium text-gray-800">{userinfo.data.name}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">나이</p>
                    <p className="text-lg font-medium text-gray-800">{userinfo.data.age}세</p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">성별</p>
                    <p className="text-lg font-medium text-gray-800">{userinfo.data.gender}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">직업</p>
                    <p className="text-lg font-medium text-gray-800">{userinfo.data.occupation}</p>
                </div>
            </div>
            <button
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => window.location.reload()}>
                정보 새로고침
            </button>
        </div>
    )
}

export default UserInfo
