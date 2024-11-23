import { fetchData } from '../util'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const Auth = {
    // 회원가입 API
    async registerUser({ username, password, age, gender, occupation }) {
        const url = `${BASE_URL}/api/users/register`
        return await fetchData({
            url,
            method: 'POST',
            body: { username, password, age, gender, occupation }
        })
    },

    // 로그인 API
    async loginUser({ username, password }) {
        const url = `${BASE_URL}/api/users/login`
        return await fetchData({
            url,
            method: 'POST',
            body: { username, password }
        })
    }
}

export default Auth
