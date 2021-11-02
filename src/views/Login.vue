<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col md="12" lg="4">
        <v-card elevation="10" outlined>
          <v-card-title>Vstupit do aplikace</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Login" prepend-icon="mdi-account" color="secondary"/>
              <v-text-field label="Heslo" prepend-icon="mdi-key" color="secondary"/>
            </v-form>
          </v-card-text>
          <v-card-text class="my-n4">
            <v-btn x-small text plain>
              Nejste ještě registrován?
            </v-btn>
          </v-card-text>
          <v-card-actions class="px-5">
            <v-btn text class="orange--text">
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
  name: "Login"
}
</script>

<style scoped>

</style>