<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      max-width="400"
      persistent
    >

      <v-card
        prepend-icon="mdi-cookie-alert-outline"
        text="This website uses cookies to improve your experience. By continuing to browse, you agree to the use of cookies"
        title="Accept the terms to continue"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="acceptCookies">
            Agree
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
    mounted(){
      this.dialog = localStorage.getItem('acceptedCookies') ? false : true;
    },
    methods: {
    acceptCookies() {
      localStorage.setItem('acceptedCookies', true);
      this.dialog = false;
    }
  }
  }
</script>

