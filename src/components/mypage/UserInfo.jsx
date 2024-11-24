import { useEffect, useState } from 'react';

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null); // 올바르게 상태 선언

    // 더미 데이터 (API 호출을 대신하는 더미 데이터)
    const dummyUserData = {
        email: 'user@example.com',
        name: '홍길동',
        age: 29,
        gender: '남성',
        occupation: '소프트웨어 개발자',
    };

    useEffect(() => {
        setUserInfo(dummyUserData); // 상태값 업데이트
    }, []);

    if (!userInfo) {
        return <p>로딩 중...</p>; // 로딩 상태 처리
    }

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
    );
};

export default UserInfo;
