import { defineStore } from 'pinia'
import { createToast } from 'mosha-vue-toastify';
import Cookies from 'js-cookie';


import router from '@/router'
import { loginTokenUser } from '@/services/auth';
import parseJWT from '../utils/parseJWT'


export const useAppStore = defineStore('app', {
  state: () => {
      return {
          is_connected: Cookies.get('access_token') || false,
          returnUrl: null,
          nameUser: parseJWT(Cookies.get('access_token'))?.name || null,
          roles: parseJWT(Cookies.get('access_token'))?.roles || [],
          isAdminUser: parseJWT(Cookies.get('access_token'))?.is_admin || null,
          isConnecting: false
      }
  },
  actions: {
    loginUser(data) {
      loginTokenUser(data)
        .then((response) => {
          Cookies.set('access_token', response.data.access_token, { secure: true });
          Cookies.set('refresh_token', response.data.refresh_token, { secure: true });
          const tokenData = parseJWT(response.data.access_token)
          this.isAdminUser = tokenData.is_admin
          this.roles = tokenData.roles
          this.nameUser = tokenData.name
          this.is_connected = true
          this.isConnecting = false
          router.push(this.returnUrl || '/')
        })
        .catch(() => {
          this.isConnecting = false
          createToast("Email/Password is wrong", {type: 'danger', showIcon: true})
          }
        )
      },
      logout() {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        this.is_connected = false;
        this.isAdminUser = null;
        this.nameUser = null;
        this.roles = [];
        router.push('/login');
      },
      hasPermission(permissions) {
        return this.isAdminUser || this.roles.some(role => permissions.includes(role));
      }
  }
})