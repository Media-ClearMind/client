import { Link, useLocation } from 'react-router-dom'

const NavItemContainer = ({ children, path }) => {
    const location = useLocation() // 현재 경로 정보 제공 (ex) /home
    const isActive = path === location.pathname

    return (
        <Link
            to={path}
            className={`flex flex-col items-center text-center flex-1 text-sm font-light ${
                isActive ? 'text-blue-600' : 'text-gray-400'
            }`}>
            <div className={`w-5 h-5 ${isActive ? 'fill-blue-600' : 'fill-gray-500'}`}>
                {children}
            </div>
        </Link>
    )
}

export default NavItemContainer
