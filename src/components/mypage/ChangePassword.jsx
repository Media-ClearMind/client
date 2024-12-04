import Auth from '@/lib/api/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleChangePassword = async () => {
        setError(null)

        if (newPassword !== confirmPassword) {
            setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
            return
        }

        try {
            const response = await Auth.changePassword({ currentPassword, newPassword })
            console.log('비밀번호 변경 성공:', response)
            alert('비밀번호가 성공적으로 변경되었습니다.')
            navigate('/mypage')
        } catch (err) {
            console.error('비밀번호 변경 실패:', err)
            setError('비밀번호 변경에 실패했습니다.')
        }
    }

    return (
        <div className="mt-10 p-6 bg-white text-black shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">비밀번호 변경</h2>
            <div className="mb-4">
                <label className="block text-gray-500 text-sm font-medium mb-2">
                    현재 비밀번호
                </label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="현재 비밀번호"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-500 text-sm font-medium mb-2">새 비밀번호</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="새 비밀번호"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-500 text-sm font-medium mb-2">
                    비밀번호 확인
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="비밀번호 확인"
                />
            </div>
            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
            <button
                onClick={handleChangePassword}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                비밀번호 변경
            </button>
        </div>
    )
}

export default ChangePassword
