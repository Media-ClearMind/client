import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Footer from '@/components/common/footer/index' // Footer 컴포넌트 import
import LoadingPage from '@/pages/Loading'

const Layout = ({ withLoading }) => {
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (withLoading) {
            setIsLoading(true)
            const timer = setTimeout(() => setIsLoading(false), 1000) // 1초 로딩
            return () => clearTimeout(timer)
        }
    }, [location.pathname, withLoading])

    if (isLoading) {
        return (
            <div className="h-screen relative">
                <div className="max-w-md h-full flex flex-col mx-auto">
                    <LoadingPage />
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="h-screen relative">
            <div className="max-w-md h-full flex flex-col mx-auto">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Layout
