import { fetchData } from '../util'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const UserData = {
    async getStatistics() {
        const url = `${BASE_URL}/api/analysis/statistics`
        return await fetchData({
            url,
            method: 'GET',
            additionalHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // 인증 헤더 추가
            },
            body: {}
        })
    }
}
