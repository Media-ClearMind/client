import { create } from 'zustand'

const useUserStore = create(set => ({
    user: null,
    setUser: userData => set({ user: userData }),
    getUserName: () => get => get().user?.name, // 이름
    getUserAge: () => get => get().user?.age, // 나이
    getUserGender: () => get => get().user?.gender, // 성별
    getUserOccupation: () => get => get().user?.occupation // 직업
}))

export default useUserStore
