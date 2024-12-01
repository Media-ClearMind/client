import axios from 'axios'

export async function fetchData(args) {
    const { url, method, body, isFormData, file, additionalHeaders, AuthOn } = args
    const headers = {
        ...additionalHeaders // 추가 헤더 병합
    }

    // 인증 헤더 추가 (AuthOn이 true일 경우)
    if (AuthOn) {
        const token = localStorage.getItem('token') // localStorage에서 token 가져오기
        if (token) {
            headers['Authorization'] = `Bearer ${token}` // 인증 토큰 추가
        } else {
            throw new Error('No authentication token found') // 토큰이 없을 경우 에러 발생
        }
    }

    // JSON 요청의 경우 Content-Type 설정
    if (!isFormData && !file) {
        headers['Content-Type'] = 'application/json'
    }

    try {
        // 파일을 Base64로 변환
        if (file) {
            const base64File = await convertFileToBase64(file) // FileReader로 Base64 변환
            if (body) {
                body.image = base64File // body에 Base64 데이터 추가
            } else {
                body = { image: base64File }
            }
        }

        // API 요청
        const response = await axios({
            url,
            method,
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

// File을 Base64로 변환하는 함수
async function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}
