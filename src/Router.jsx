import { BrowserRouter, Route, Routes } from 'react-router-dom'

//import Home from './pages/Home'
import Layout from './components/common/layout'
import Mypage from './pages/mypage/mypage'
import Home from './pages/Home'
import DetailPage from './pages/mypage/DetailPage'

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
