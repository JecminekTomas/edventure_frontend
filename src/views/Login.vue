<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col md="12" lg="4">
        <v-card elevation="10" outlined class="px-10 py-10">
          <v-card-title>Vstupit do aplikace</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                  v-model="userName"
                  label="Uživatelské jméno"
                  color="secondary"
                  @click="resetError"
              />
              <v-text-field
                  v-model="password"
                  :type="showPassword? 'text': 'password'"
                  label="Heslo"
                  color="secondary"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  @click="resetError"
              />
            </v-form>
            <v-alert
                v-if="error"
                dense
                outlined
                type="error">
              Špatné přihlašovací údaje
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn text class="orange--text" type="submit" @click="doLogin">
              Přihlásit se
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
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
    }
  }
}
</script>

<style scoped>

</style>