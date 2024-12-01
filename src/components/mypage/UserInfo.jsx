import { useEffect, useState } from 'react'

import Auth from '@/lib/api/auth'
import { useNavigate } from 'react-router-dom'

const UserInfo = () => {
    const [userinfo, setUserInfo] = useState(null) // 사용자 정보를 저장할 상태
    const [isEditing, setIsEditing] = useState(false) // 수정 모드 상태
    const [editedInfo, setEditedInfo] = useState(null) // 수정 중인 정보
    const [isLoading, setIsLoading] = useState(true) // 로딩 상태
    const [error, setError] = useState(null) // 에러 상태
    const navigate = useNavigate()

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

    const handleSave = async () => {
        try {
            setIsLoading(true)
            await Auth.updateUserProfile(editedInfo) // PUT 요청으로 사용자 정보 수정
            setIsEditing(false) // 수정 모드 종료
            setUserInfo(prev => ({ ...prev, data: editedInfo })) // 수정된 정보 업데이트
            alert('프로필이 성공적으로 업데이트되었습니다.')
        } catch (err) {
            console.error('프로필 업데이트 실패:', err)
            alert('프로필 업데이트 중 문제가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

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
        <div className="max-w-2xl mx-auto mt-10 p-6 text-black bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">내 프로필</h2>
            {isEditing ? (
                // 수정 모드 화면
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <p className="text-gray-500 text-sm">이름</p>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={editedInfo.name}
                            onChange={e => setEditedInfo({ ...editedInfo, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">나이</p>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={editedInfo.age}
                            onChange={e =>
                                setEditedInfo({ ...editedInfo, age: parseInt(e.target.value) })
                            }
                        />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">성별</p>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={editedInfo.gender}
                            onChange={e =>
                                setEditedInfo({ ...editedInfo, gender: e.target.value })
                            }>
                            <option value="남성">남성</option>
                            <option value="여성">여성</option>
                        </select>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">직업</p>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={editedInfo.occupation}
                            onChange={e =>
                                setEditedInfo({ ...editedInfo, occupation: e.target.value })
                            }
                        />
                    </div>
                </div>
            ) : (
                // 기본 화면
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
                        <p className="text-lg font-medium text-gray-800">
                            {userinfo.data.occupation}
                        </p>
                    </div>
                </div>
            )}
            <div className="mt-6 flex justify-between space-x-4">
                {isEditing ? (
                    <>
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                            onClick={() => setIsEditing(false)}>
                            취소
                        </button>
                        <button
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            onClick={handleSave}>
                            저장
                        </button>
                    </>
                ) : (
                    <button
                        className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => {
                            setIsEditing(true)
                            setEditedInfo(userinfo.data) // 기존 사용자 정보 설정
                        }}>
                        프로필 수정
                    </button>
                )}
                <button
                    className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => navigate('/change-password')}>
                    비밀번호 변경
                </button>
            </div>
            <button
                className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => window.location.reload()}>
                정보 새로고침
            </button>
        </div>
    )
}

export default UserInfo
