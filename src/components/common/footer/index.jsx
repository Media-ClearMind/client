import { Link, useLocation } from 'react-router-dom'

import HomeIcons from '@/assets/icons/home-icon.svg?url'
import MapIcons from '@/assets/icons/map-icon.svg?url'
import PaperIcons from '@/assets/icons/paper-icon.svg?url'
import ProfileIcons from '@/assets/icons/profile-icon.svg?url'

const NavItemContainer = ({ path, title, icon }) => {
    const location = useLocation()
    const isActive = path === location.pathname

    return (
        <Link
            to={path}
            className={`flex flex-col items-center text-center flex-1 text-sm ${
                isActive ? 'text-blue-600' : 'text-gray-400'
            }`}>
            <img
                src={icon}
                alt={`${title} icon`}
                className={`w-5 h-5 mb-1 ${isActive ? 'opacity-100' : 'opacity-50'}`}
            />
            <p className="text-xs font-bold">{title}</p>
        </Link>
    )
}

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg h-16 flex justify-between items-center bg-white border-t border-gray-200 px-4 z-50">
            <nav className="flex w-full justify-between items-center">
                <NavItemContainer
                    path="/home"
                    title="HOME"
                    icon={HomeIcons}
                />
                <NavItemContainer
                    path="/setting"
                    title="SETTING"
                    icon={PaperIcons}
                />
                <NavItemContainer
                    path="/kakaomap"
                    title="MAP"
                    icon={MapIcons}
                />
                <NavItemContainer
                    path="/mypage"
                    title="PROFILE"
                    icon={ProfileIcons}
                />
            </nav>
        </footer>
    )
}

export default Footer
