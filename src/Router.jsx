import { BrowserRouter, Route, Routes } from 'react-router-dom'

import DetailPage from '@/pages/mypage/DetailPage'
import HomePage from '@/pages/Home'
import Layout from '@/components/common/layout/index'
import LoginPage from '@/pages/Login'
import Mypage from '@/pages/mypage/Mypage'
import NoFooterLayout from '@/components/common/layout/no-footer/index'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import SignupPage from '@/pages/Signup'
import WelcomePage from '@/pages/Main'

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* NoFooterLayout: signup, login */}
                <Route element={<NoFooterLayout withLoading />}>
                    <Route
                        path="/"
                        element={<WelcomePage />}
                    />
                    <Route
                        path="/signup"
                        element={<SignupPage />}
                    />
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />
                </Route>

                {/* Layout: 루트 및 home */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout withLoading />
                        </ProtectedRoute>
                    }>
                    <Route
                        path="/home"
                        element={<HomePage />}
                    />
                    <Route
                        path="/mypage"
                        element={<Mypage />}
                    />
                    <Route
                        path="/detail/:analysis_id"
                        element={<DetailPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
