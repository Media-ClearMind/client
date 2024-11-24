import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import LoadingPage from '@/pages/Loading'

const NoFooterLayout = ({ withLoading }) => {
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (withLoading) {
            setIsLoading(true)
            const timer = setTimeout(() => setIsLoading(false), 200) // 1초 로딩
            return () => clearTimeout(timer)
        }
    }, [location.pathname, withLoading])

    if (isLoading) {
        return (
            <div className="h-screen relative">
                <div className="max-w-md h-full flex flex-col mx-auto">
                    <LoadingPage />
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen relative">
            <div className="max-w-md h-full flex flex-col mx-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default NoFooterLayout
