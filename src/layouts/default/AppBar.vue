<template>
  <v-app-bar color="indigo">
    <v-app-bar-title>
      <v-icon icon="mdi-flash" />
      Flash Decorator
    </v-app-bar-title>

    <div class="pa-4 mx-auto">
      <v-btn class="ml-2" color="white" to="/">
        <v-icon>mdi-view-dashboard</v-icon>Dashboard
      </v-btn>
      <v-btn class="ml-2" variant="outlined" color="yellow" to="/flash-cards">
        <v-icon>mdi-brain</v-icon>Learn
      </v-btn>
      <v-menu v-if="items.filter((item) => item.routeAdmin ? isAdminUser : hasPermission(item.permissions)).length > 0">
        <template v-slot:activator="{ props }">
          <v-btn class="ml-2" color="white" v-bind="props">
            <v-icon>mdi-shield</v-icon>Admin
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items.filter((item) => item.routeAdmin ? isAdminUser : hasPermission(item.permissions))"
            :key="index" :value="index" :to="item.to">
            <v-list-item-title>
              <v-icon>mdi-{{ item.icon }}</v-icon>{{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn stacked variant="text" v-bind="props">
            Hello, {{ nameUser }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/change-password">
            <v-list-item-title>
              <v-icon>mdi-lock-reset</v-icon>Change password
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn @click="logout" title="Exit">
        <v-icon>mdi-logout</v-icon>Exit
      </v-btn>
    </div>

  </v-app-bar>
</template>

<script>
import { useAppStore } from "@/store/app";

export default {
  setup() {
    const appStore = useAppStore();
    const { logout, isAdminUser, nameUser, hasPermission } = appStore;
    return {
      logout,
      isAdminUser,
      nameUser,
      hasPermission
    };
  },
  data: () => ({
    items: [
      { title: 'Words', to: '/words', icon: 'file-word-box', permissions: ['create_word', 'update_word', 'delete_word'], routeAdmin: false },
      { title: 'Sets', to: '/sets', icon: 'ungroup', permissions: ['create_set_words', 'update_set_words', 'delete_set_words'], routeAdmin: false },
      { title: 'Users', to: '/users-list', icon: 'account-multiple', permissions: [], routeAdmin: true },
    ],
  }),
  methods: {
    async logout() {
      this.logout();
    },
  },
};
</script>


<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
