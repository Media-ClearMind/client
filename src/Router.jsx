import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from '@/components/common/layout/index'
import LoginPage from '@/pages/Login'
import SignupPage from '@/pages/Signup'
import WelcomePage from '@/pages/Home'

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 루트 경로 */}
                <Route
                    path="/"
                    element={<Layout />}>
                    <Route
                        index
                        element={<WelcomePage />}
                    />
                    <Route
                        path="signup"
                        element={<SignupPage />}
                    />
                    <Route
                        path="login"
                        element={<LoginPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
