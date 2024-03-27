import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import Cookies from 'js-cookie';

import router from '@/router'
import { useAppStore } from '@/store/app'
import { refreshToken } from './auth'


const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API
})

const urlRefresh = 'api/auth/refresh'

api.interceptors.request.use(request => {
    let accessToken = Cookies.get('access_token');

    if (accessToken && accessToken !== '' && request.url !== urlRefresh) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    else if(request.url == urlRefresh){
        let refreshToken = Cookies.get('refresh_token');
        request.headers['Authorization'] = `Bearer ${refreshToken}`;
    }
    return request
})


function createAxiosResponseInterceptor() {
    const interceptor = api.interceptors.response.use(
        response => response,
        error => {

            if (error.response.status === 403 || error.response.status === 405) {
                createToast('User not authorized', { type: 'danger', showIcon: true })
                router.push('/')
                return Promise.resolve(error)
            } else if (error.response.status === 500) {
                createToast('Server error', { type: 'danger', showIcon: true })
                return Promise.reject(error)
            }
            else if (error.response.status === 429) {
                createToast('Request limit reached, try later', { type: 'danger', showIcon: true })
                return Promise.reject(error)
            }
            else if (error.response.status !== 401) {
                return Promise.reject(error)
            }

            api.interceptors.response.eject(interceptor)

            const refresh_token = Cookies.get("refresh_token")
            if(refresh_token){
                return refreshToken()
                .then(response => {
                    Cookies.set("access_token", response.data.access_token, { secure: true })
                    return api(error.response.config)
                }).catch(err => {
                    if (err.response.config.url === urlRefresh) {
                        createToast('Session expired', { type: 'danger', showIcon: true })
                        const appStore = useAppStore();
                        const { logout } = appStore;
                        logout();
                    }
                    return Promise.resolve(error);
                    
                }).finally(() => createAxiosResponseInterceptor(api))
            }

            return Promise.reject(error);

        }

    )
}

createAxiosResponseInterceptor()

export default api