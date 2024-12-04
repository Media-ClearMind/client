import { useEffect, useState } from 'react'

import LoadingPage from '@/pages/Loading'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        // localStorage에서 토큰 확인
        const token = localStorage.getItem('token')
        setIsAuthenticated(!!token) // 토큰이 있으면 true, 없으면 false
    }, [])

    // 초기 로딩 상태
    if (isAuthenticated === null) {
        return <LoadingPage />
    }

    // 인증되지 않은 경우 -> /login으로 리다이렉트
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }

    // 인증된 경우 -> children 렌더링
    return children
}
