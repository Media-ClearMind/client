import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import LoadingPage from '@/pages/Loading'

const NoFooterLayout = ({ withLoading }) => {
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    // 로딩 상태 관리
    useEffect(() => {
        if (withLoading) {
            setIsLoading(true)
            const timer = setTimeout(() => setIsLoading(false), 200) // 0.2초 로딩
            return () => clearTimeout(timer)
        }
    }, [location.pathname, withLoading])

    // 인증 상태 확인
    useEffect(() => {
        const token = localStorage.getItem('token') // 로컬스토리지에서 토큰 확인
        setIsAuthenticated(!!token) // 토큰이 있으면 true, 없으면 false
    }, [])

    // 로딩 중인 경우
    if (isLoading) {
        return (
            <div className="h-screen relative">
                <div className="max-w-md h-full flex flex-col mx-auto">
                    <LoadingPage />
                </div>
            </div>
        )
    }

    // 인증된 경우 /home으로 리다이렉트
    if (isAuthenticated) {
        return (
            <Navigate
                to="/home"
                replace
            />
        )
    }

    // 인증되지 않은 경우 자식 컴포넌트 렌더링
    return (
        <div className="h-screen relative">
            <div className="max-w-md h-full flex flex-col mx-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default NoFooterLayout
