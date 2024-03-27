<template>
    <div>
      <v-card
        class="mx-auto pa-12 pb-4 my-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
      <v-card-title class="text-h6 text-md-h5 text-lg-h4 ml-8 mb-2">Flash Decorator</v-card-title>

      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
  
        <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
          :rules="emailRules"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>
  
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="password"
          :rules="passwordRules"
        ></v-text-field>

  
        <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="login"
          :loading="isConnecting"
        >
          Log In
        </v-btn>
      </v-form>
      
        <v-card-text class="text-center">
            <router-link 
              to="/register-user"
              class="text-blue text-decoration-none"
              >
                <v-icon icon="mdi-chevron-right"></v-icon>Sign up now
            </router-link> 
        </v-card-text>
      </v-card>
    </div>
    <NoticeCookies />
  </template>


<script>
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/app";

import NoticeCookies from '../components/NoticeCookies.vue'

export default {
  name: "Login",
  components: {
    NoticeCookies,
  },
  setup() {
    const appStore = useAppStore();
    const { loginUser } = appStore;
    const { isConnecting } = storeToRefs(appStore);

    return {
      loginUser,
      isConnecting,
    };
  },
  data: () => ({
    visible: false,
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "Email is required",
       v => /.+@.+/.test(v) || 'Invalid Email address',
      ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
    ],
  }),
  methods: {
    async login() {
      const { valid } = await this.$refs.form.validate();
      
      if(valid){
        this.isConnecting = true

        const data = {
            "email": this.email,
            "password": this.password
        }
        this.loginUser(data)
      }
      
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

  },
};
</script>