import { BrowserRouter, Route, Routes } from 'react-router-dom'

import DetailPage from '@/pages/mypage/DetailPage'
import HomePage from '@/pages/Home'
import Layout from '@/components/common/layout/index'
import LoginPage from '@/pages/Login'
import Mypage from '@/pages/mypage/Mypage'
import NoFooterLayout from '@/components/common/layout/no-footer/index'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import SignupPage from '@/pages/Signup'
import VoiceChat from '@/pages/Analysis'
import WelcomePage from '@/pages/Main'
import ChangePassword from './components/mypage/ChangePassword'

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
                        element={<HomePage user={{ displayName: '김민태' }} />}
                    />
                    <Route
                        path="/mypage"
                        element={<Mypage />}
                    />
                    <Route
                        path="/detail/:count"
                        element={<DetailPage />}
                    />
                    <Route
                        path="/analysis"
                        element={<VoiceChat />}
                    />
                    <Route
                        path="/change-password"
                        element={<ChangePassword />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
