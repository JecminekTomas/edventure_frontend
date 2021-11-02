<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col md="12" lg="4">
        <v-card elevation="10" outlined class="px-sm-10 py-sm-10">
          <v-card-title>Zápis do aplikace</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Křestní jméno" color="secondary"/>
              <v-text-field label="Příjmení" color="secondary"/>
              <v-text-field label="Uživatelské jméno" color="secondary"/>
              <v-text-field
                  :type="showPassword? 'text': 'password'"
                  label="Heslo"
                  color="secondary"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
              />
              <v-text-field
                  :type="showRepPassword? 'text': 'password'"
                  label="Zopakovat heslo"
                  color="secondary"
                  :append-icon="showRepPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showRepPassword = !showRepPassword"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text class="orange--text">
              Registrovat se
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      showPassword: false,
      showRepPassword: false
    }
  }
}
</script>

<style scoped>

</style>