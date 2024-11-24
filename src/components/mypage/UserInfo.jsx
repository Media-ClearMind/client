const UserInfo = () => {
    // 더미 데이터 (API 호출을 대신하는 더미 데이터)
    const userinfo = {
        email: 'khsr98@naver.com',
        nickname: '김민태',
        age: 26,
        gender: '남성',
        occupation: '소프트웨어 개발자'
    }

    // const fetchData = async () => {
    //     try {
    //         const token = localStorage.getItem('access_token') // 토큰 가져오기
    //         const response = await axios.get(
    //             `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}` // 토큰 포함
    //                 }
    //             }
    //         )
    //         setUserInfo(response.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     fetchData()
    // }, [])

    if (!userinfo) {
        return <div>로딩 중...</div>
    }
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
