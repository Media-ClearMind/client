import axios from 'axios'

export async function fetchData(args) {
    const { url, method, body, isFormData } = args
    const headers = {}

    if (!isFormData) {
        headers['Content-Type'] = 'application/json'
    }

    try {
        // 단일 API 요청
        const response = await axios({
            url: url,
            method: method,
            headers,
            data: body
        })

        return response.data // 성공적으로 데이터를 반환
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error executing request') // Axios 에러 처리
        } else {
            throw new Error('An unexpected error occurred') // 기타 에러 처리
        }
    }
}
