import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Layout from './components/common/Layout'
import LoginPage from './pages/Login' // LoginPage 경로를 올바르게 설정하세요.
import SignupPage from './pages/Signup' // SignupPage 경로를 올바르게 설정하세요.

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
