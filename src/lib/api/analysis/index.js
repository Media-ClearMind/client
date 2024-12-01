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
            AuthOn: true, // 인증 헤더 추가
            body: {
                startDate,
                endDate,
                page,
                limit
            }
        })
    },

    // 인터뷰 결과 제출 API
    async submitInterviewResult({ questionsAnswers, score }) {
        const url = `${BASE_URL}/api/interviews/submit`
        return await fetchData({
            url,
            method: 'POST',
            AuthOn: true, // 인증 헤더 추가
            body: {
                questions_answers: questionsAnswers, // 질문과 답변 배열
                score // 최종 점수
            }
        })
    }
}

export default Analysis
