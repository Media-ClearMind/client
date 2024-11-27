import useUserStore from '../../stores/useUserStore'

const UserInfo = () => {
    const user = useUserStore(state => state.user)

    // user가 로드되기 전에는 "익명"으로 표시
    const userName = user ? user.name : '익명'
    const userAge = user ? user.age : '정보 없음'
    const userGender = user ? user.gender : '정보 없음'
    const userOccupation = user ? user.occupation : '정보 없음'

    return (
        <div className="max-w-md mx-auto p-6 bg-white text-black shadow-md rounded-md">
            <p>
                <strong>이름:</strong> {userName}
            </p>
            <p>
                <strong>나이:</strong> {userAge}세
            </p>
            <p>
                <strong>성별:</strong> {userGender}
            </p>
            <p>
                <strong>직업:</strong> {userOccupation}
            </p>
        </div>
    )
}

export default UserInfo
