import axios from 'axios'
import { useEffect, useState } from 'react'

const UserInfo = () => {
    const [userinfo, setUserInfo] = useState()

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/users/profile`)
            setUserInfo(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
  
    return (
        <div className="max-w-md mx-auto p-6 bg-white text-black shadow-md rounded-md">
            {/* 사용자 정보 */}
            <p>
                <strong>이름:</strong> {userinfo.nickname}
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
