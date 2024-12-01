import Auth from '../auth'
import { fetchData } from '../util'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const Analysis = {
    // 기간별 분석 결과 조회
    async getAnalysisHistory({ startDate, endDate, page = 1, limit = 20 }) {
        const url = `${BASE_URL}/api/analysis/history`
        return await fetchData({
            url,
            method: 'GET',
            AuthOn: true,
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
