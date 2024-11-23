import { useEffect, useState } from 'react'

import LoadingPage from '@/pages/Loading'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        // localStorage에서 토큰 확인
        const token = localStorage.getItem('token')

        // 토큰이 존재하면 인증된 것으로 간주
        if (token) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [])

    // 초기 상태
    if (isAuthenticated === null) {
        return <LoadingPage />
    }

    // 인증되지 않은 경우 -> /login으로 리다이렉트
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    // 인증된 경우 -> 자식 컴포넌트 렌더링
    return children
}
