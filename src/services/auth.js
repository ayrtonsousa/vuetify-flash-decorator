import api from './api'


export const loginTokenUser = (data) => {
    return api.post('/api/auth/login', data)
}

export const refreshToken = async () => {
    return await api.post("api/auth/refresh")
}