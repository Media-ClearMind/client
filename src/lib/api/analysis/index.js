import Auth from '../auth'
import { fetchData } from '../util'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const Analysis = {
    // 기간별 분석 결과 조회
    async getAnalysisHistory({ startDate, endDate }) {
        // 쿼리 스트링 형식으로 URL 생성
        const url = `${BASE_URL}/api/result?startDate=${startDate}&endDate=${endDate}`

        return await fetchData({
            url,
            method: 'GET',
            AuthOn: true // 인증 헤더 추가
        })
    },

    // 인터뷰 결과 제출 API
    async submitInterviewResult(combinedData) {
        const url = `${BASE_URL}/api/interviews/submit`
        return await fetchData({
            url,
            method: 'POST',
            AuthOn: true,
            body: combinedData
        })
    }
}

export default Analysis
