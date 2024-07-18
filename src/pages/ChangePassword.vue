<template>
    <v-sheet class="mx-auto" width="300">
    <h4 class="text-h5  mb-4">Change your password</h4>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
            v-model="oldPassword"
            :rules="oldPasswordRules"
            label="Current Password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            @click:append-inner="visible = !visible"
        ></v-text-field>
  
        <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="New password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-text-field
            v-model="confirmationPassword"
            :rules="confirmationPasswordRules"
            label="Confirm password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            @click:append-inner="visible = !visible"
        ></v-text-field>
  
        <v-btn class="mt-2" block @click="validate">Submit</v-btn>
      </v-form>
    </v-sheet>
  </template>

<script>
import { userService } from '../services/user'
import { createToast } from 'mosha-vue-toastify'


  export default {
    data: () => ({
    valid: true,
    visible: false,
    oldPassword: "",
    oldPasswordRules: [(v) => !!v || "Current password is required"],
    password: "",
    passwordRules: [
        (v) => !!v || "New password is required",
        (v) => (v && v.length >= 3) || "New password must be more than 2 characters",
    ],
    confirmationPassword: "",
    confirmationPasswordRules: [],
    }),
    created() {
        this.confirmationPasswordRules = [
        (v) => !!v || 'Confirmation password is required',
        (v) => v === this.password || 'Passwords do not match',
        ];
    },
    methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const data = {
          "old_password": this.oldPassword,
          "new_password": this.password
        }
        userService.changePassword(data)
          .then((response) => {
            createToast("Change password successfully", { type: 'success', showIcon: true })
            setTimeout(() => {
              this.$router.push('/');
            }, 1000);
          }).catch((error) => {
            createToast("Change password failure", { type: 'danger', showIcon: true })
            if (error.response.status === 400) { 
                createToast(error.response.data.message, { type: 'danger', showIcon: true })
            } 
          })
      }
    }
  },
  }
</script>