import { fetchData } from '../util'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const Analysis = {
    // 기간별 분석 결과 조회
    async getAnalysisHistory({ startDate, endDate, page = 1, limit = 20 }) {
        const url = `${BASE_URL}/api/analysis/history`
        return await fetchData({
            url,
            method: 'GET',
            additionalHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // 인증 헤더 추가
            },
            body: {
                startDate,
                endDate,
                page,
                limit
            }
        })
    }
}

export default Analysis
