import axios from 'axios'
import { useState, useEffect } from 'react'

const UserInfo = () => {
    const [userinfo, setUserInfo] = useState(null)

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token') // 토큰 가져오기
            if (!token) {
                throw new Error('Token not found') // 토큰이 없을 경우 에러 처리
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // 토큰 포함
                    }
                }
            )

            setUserInfo(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (!userinfo) {
        return <div>로딩 중...</div>
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white text-black shadow-md rounded-md">
            <p>
                <strong>이름:</strong> {userinfo.name}
            </p>
            <p>
                <strong>나이:</strong> {userinfo.age}세
            </p>
            <p>
                <strong>성별:</strong> {userinfo.gender}
            </p>
            <p>
                <strong>직업:</strong> {userinfo.occupation}
            </p>
        </div>
    )
}

export default UserInfo
