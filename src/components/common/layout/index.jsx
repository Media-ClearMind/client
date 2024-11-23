import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className="h-screen relative">
            <div className="max-w-md h-full flex flex-col mx-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
