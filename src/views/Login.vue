<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col md="12" lg="4">
        <v-card elevation="10" outlined class="px-10 py-10">
          <v-card-title>Vstupit do aplikace</v-card-title>
          <v-alert
              v-if="error"
              dense
              outlined
              type="error">
            Špatné přihlašovací údaje
          </v-alert>
          <v-form @submit.prevent="doLogin">
            <v-card-text>
              <v-text-field
                  v-model="userName"
                  label="Uživatelské jméno"
                  :error-messages="userNameErrors"
                  color="secondary"
                  @click="resetError"
                  @blur="$v.userName.$touch()"
              />
              <v-text-field
                  v-model="password"
                  label="Heslo"
                  :error-messages="passwordErrors"
                  :type="showPassword? 'text': 'password'"
                  color="secondary"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  @click="resetError"
                  @blur="$v.password.$touch()"
              />
            </v-card-text>
            <v-btn text plain class="text-caption" :ripple="false" :to="{name: 'register'}">
              Ještě nejste zaregistrováni?
            </v-btn>
            <v-card-actions>
              <v-btn text class="secondary--text" type="submit">
                Přihlásit se
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

export default {
  name: "Login",

  mixins: [validationMixin],

  validations: {
    userName: {required},
    password: {required},
  },

  data() {
    return {
      userName: "",
      password: "",
      showPassword: false,
      error: null
    }
  },

  methods: {
    async doLogin() {
      this.$v.$reset()
      this.resetError()
      try {
        const response = await this.$http.post("/login", {userName: this.userName, password: this.password})
        this.$tokenManager.setToken(response.data.token)
        await this.$router.push({name: "offers"})
      } catch (e) {
        if (e.response.statusCode === 401) {
          this.error = "Špatné přihlašovací údaje"
        } else {
          this.error = e.response.data.error
        }
      }
    },
    resetError() {
      this.error = null
    },
  },

  computed: {
    userNameErrors() {
      const errors = []
      if (!this.$v.userName.$dirty)
        return errors

      !this.$v.userName.required && errors.push('*Povinné pole')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty)
        return errors

      !this.$v.password.required && errors.push('*Povinné pole')
      return errors
    },
  }
}
</script>

<style scoped>

</style>