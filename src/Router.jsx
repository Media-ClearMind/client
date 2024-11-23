import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '@/pages/Home'
import Layout from '@/components/common/layout/index'
import LoginPage from '@/pages/Login'
import NoFooterLayout from '@/components/common/layout/no-footer/index'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import SignupPage from '@/pages/Signup'
import WelcomePage from '@/pages/Main'
import Mypage from './pages/mypage/mypage'
import DetailPage from './pages/mypage/DetailPage'


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* NoFooterLayout: signup, login */}
                <Route element={<NoFooterLayout />}>
                    <Route
                        path={'/'}
                        element={<WelcomePage />}
                    />
                    <Route
                        path={'/signup'}
                        element={<SignupPage />}
                    />
                    <Route
                        path={'/login'}
                        element={<LoginPage />}
                    />
                </Route>

                {/* Layout: 루트 및 home */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
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
            path="/detail/:date"
            element={<DetailPage />}
          />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
