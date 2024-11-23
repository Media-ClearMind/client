import Footer from '@/components/common/footer/index' // Footer 컴포넌트 import
import { Outlet } from 'react-router-dom'

const Layout = () => {
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
