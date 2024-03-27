// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store/app';
import { createToast } from 'mosha-vue-toastify';


const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard/index.vue'),
      },
      {
        path: '/flash-cards',
        name: 'FlashCards',
        component: () => import('@/pages/FlashCards.vue'),
      },
      {
        path: '/flash-card/:id',
        name: 'FlashCard',
        component: () => import('@/pages/FlashCard.vue'),
      },
      {
        path: '/words',
        name: 'Words',
        component: () => import('@/pages/Words.vue'),
      }
      ,
      {
        path: '/sets',
        name: 'Sets',
        component: () => import('@/pages/Sets.vue'),
      },
      {
        path: '/users-list',
        name: 'Users',
        component: () => import('@/pages/UsersList.vue'),
      }  
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/register-user',
    name: 'RegisterUser',
    component: () => import('@/pages/RegisterUser.vue'),
  }
]

function checkPermission(to, permissions, mapPermissions, isAdmin) {

  const requiredPermissions = mapPermissions[to.name];

  if(requiredPermissions?.only_admin){
    return isAdmin == requiredPermissions.only_admin
  }

  if (requiredPermissions) {
    return isAdmin || requiredPermissions.some(permission => permissions.includes(permission));
  }

  return true;
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {

  const publicPages = ['/login','/register-user'];
  const routePermissionsMap = {
    'Words': ['create_word', 'update_word', 'delete_word'],
    'Sets': ['create_set_words', 'update_set_words', 'delete_set_words'],
    'Users': {'only_admin': true}
  };
  const authRequired = !publicPages.includes(to.path);
  const appStore = useAppStore();

  if (authRequired && !appStore.is_connected) {
      createToast('User disconnected', {type: 'danger', showIcon: true})
      useAppStore.returnUrl = to.fullPath;
      next('/login');
   }
   else {
    if (!checkPermission(to, appStore.roles, routePermissionsMap, appStore.isAdminUser)) {
      createToast('User not authorized', {type: 'danger', showIcon: true})
      next('/');
    } else {
      next();
    }
  }
});

router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location = to.fullPath
  }
})



export default router
