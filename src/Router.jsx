import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from '@/components/pages/Home'
import Layout from '@/components/common/Layout'
import LoginPage from '@/components/pages/Login'
import SignupPage from '@/components/pages/Signup'

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
                        element={<Home />}
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
