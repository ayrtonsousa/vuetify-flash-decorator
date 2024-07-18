<template>
  <div>
    <v-card class="mx-auto pa-12 pb-4 my-8" elevation="8" max-width="448" rounded="lg">
      <v-card-title class="text-h6 text-md-h5 text-lg-h4 ml-8 mb-2">Flash Decorator</v-card-title>

      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>

        <v-text-field density="compact" placeholder="Name" prepend-inner-icon="mdi-account-edit" variant="outlined"
          v-model="name" :rules="nameRules"></v-text-field>

        <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
          variant="outlined" v-model="email" :rules="emailRules"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>

        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible" v-model="password" :rules="passwordRules"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Confirm Password
        </div>

        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          density="compact" placeholder="Enter confirm your password" prepend-inner-icon="mdi-lock-outline"
          variant="outlined" @click:append-inner="visible = !visible" v-model="confirmationPassword"
          :rules="confirmationPasswordRules"></v-text-field>
          
        <v-checkbox v-model="agree" :rules="[v => !!v || 'You must agree to continue!']" required>
          <template v-slot:label>
            <div>
              <v-btn @click="dialog = true" variant="text">
                I
                <div class="text-lowercase">agree to the terms and privacy policy</div>
              
              </v-btn>           
            </div>
          </template>
        </v-checkbox>
        <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="validate">
          Register
        </v-btn>

      </v-form>

    </v-card>

    <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      max-width="800"
    >
    <v-card title="Privacy policies">
            <template v-slot:text>
              Política de Privacidade
              <br>
              Última atualização: 26/03/2024
              <br><br>
              Esta Política de Privacidade descreve como o Flash Decorator coleta, usa e compartilha informações
              pessoais quando você utiliza o nosso site.
              <br><br>
              Informações que coletamos
              Quando você se cadastra em nosso site, coletamos as seguintes informações pessoais:
              <br><br>
              Nome
              Endereço de e-mail
              Como usamos suas informações
              <br><br>
              Utilizamos as informações coletadas para:
              <br><br>
              Criar e gerenciar sua conta de usuário.
              Comunicar-nos com você, incluindo o envio de e-mails relacionados ao seu cadastro, suporte ao cliente e
              informações sobre nossos produtos e serviços.
              Melhorar e personalizar a sua experiência no site.
              Compartilhamento de informações
              <br><br>
              Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer os
              serviços solicitados por você ou quando exigido por lei.
              <br><br>
              Armazenamento e segurança
              <br>
              As informações pessoais que coletamos são armazenadas de forma segura em nossos servidores e são
              protegidas por medidas de segurança adequadas para prevenir acesso não autorizado, divulgação, alteração
              ou destruição.
              <br><br>
              Seus direitos
              <br>
              Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Se
              desejar exercer esses direitos, entre em contato conosco através dos meios disponibilizados no final desta
              política.
              <br><br>
              Alterações nesta política
              <br>
              Podemos atualizar esta política de privacidade periodicamente, por isso recomendamos que você reveja esta
              página regularmente para se manter informado sobre quaisquer alterações.
              <br><br>
              Contato
              <br>
              Se tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail
              ayrton.sousa@hotmail.com
            </template>

            <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Close"
              @click="dialog = false"
            ></v-btn>
          </template>
          </v-card>
    </v-dialog>
    </div>




  </div>
</template>

<script>
import { userService } from '../services/user'
import { createToast } from 'mosha-vue-toastify'

export default {
  data() {
    return {
      valid: true,
      visible: false,
      agree: false,
      dialog: false,
      name: "",
      nameRules: [(v) => !!v || "Name is required"],
      email: "",
      emailRules: [
        (v) => !!v || "Email is required",
        v => /.+@.+/.test(v) || 'Invalid Email address',
      ],
      password: "",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 3) || "Password must be more than 2 characters",
      ],
      confirmationPassword: "",
      confirmationPasswordRules: [],
    };
  },
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
          "name": this.name,
          "email": this.email,
          "password": this.password
        }
        userService.create(data)
          .then((response) => {
            createToast("User created successfully", { type: 'success', showIcon: true })
            setTimeout(() => {
              this.$router.push('/login');
            }, 1000);
          }).catch(() => {
            createToast("User creation failure ", { type: 'danger', showIcon: true })
          })
      }
    }
  },
};
</script>
