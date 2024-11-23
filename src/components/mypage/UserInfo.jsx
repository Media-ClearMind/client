import { useEffect, useState } from 'react'
import axios from 'axios'

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/users/profile') // 사용자 정보 API 호출
        setUserInfo(response.data) // API 응답 데이터 설정
        setLoading(false) // 로딩 상태 변경
      } catch (error) {
        console.log('사용자 정보를 불러오는 데 실패했습니다.', error)
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  if (loading) return <p className="text-center py-10">로딩 중...</p>
  if (!userInfo) return <p className="text-center py-10">사용자 정보를 불러올 수 없습니다.</p>

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-3">사용자 정보</h2>

      {/* 사용자 정보 */}
      <p>
        <strong>이름:</strong> {userInfo.name}
      </p>
      <p>
        <strong>나이:</strong> {userInfo.age}세
      </p>
      <p>
        <strong>성별:</strong> {userInfo.gender}
      </p>
    </div>
  )
}

export default UserInfo
