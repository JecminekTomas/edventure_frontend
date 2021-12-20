<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col md="12" lg="4">
        <v-card elevation="10" outlined class="px-10 py-10">
          <v-card-title>Zapsat se do aplikace</v-card-title>
          <v-alert
              v-if="error"
              dense
              outlined
              type="error">
            {{this.error}}
          </v-alert>
          <v-form @submit.prevent="doRegister">
            <v-card-text>
              <v-text-field
                  v-model="firstName"
                  label="Křestní jméno"
                  :error-messages="firstNameErrors"
                  color="secondary"
                  @blur="$v.firstName.$touch()"
                  @input="$v.firstName.$touch()"
              />
              <v-text-field
                  v-model="lastName"
                  label="Příjmení"
                  :error-messages="lastNameErrors"
                  color="secondary"
                  @blur="$v.lastName.$touch()"
                  @input="$v.lastName.$touch()"
              />
              <v-text-field
                  v-model="userName"
                  label="Uživatelské jméno"
                  :error-messages="userNameErrors"
                  color="secondary"
                  @blur="$v.userName.$touch()"
                  @input="$v.userName.$touch()"
              />
              <v-text-field
                  v-model="password"
                  label="Heslo"
                  :error-messages="passwordErrors"
                  :type="showPassword? 'text': 'password'"
                  color="secondary"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  @blur="$v.password.$touch()"
                  @input="$v.password.$touch()"
              />
              <v-text-field
                  v-model="repPassword"
                  label="Zopakovat heslo"
                  :error-messages="repPasswordErrors"
                  :type="showRepPassword? 'text': 'password'"
                  color="secondary"
                  :append-icon="showRepPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showRepPassword = !showRepPassword"
                  @blur="$v.repPassword.$touch()"
                  @input="$v.repPassword.$touch()"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn text class="secondary--text" type="submit" :disabled="registerButtonDisabled">
                Zaregistrovat se
              </v-btn>
            </v-card-actions>
            <v-btn text plain class="text-caption" :ripple="false" :to="{name: 'login'}">
              Již máte účet?
            </v-btn>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-select label="Typ kontaktu" color="secondary"/>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field label="Hodnota" color="secondary"/>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, sameAs, maxLength, alphaNum, helpers} from 'vuelidate/lib/validators'

// eslint-disable-next-line no-control-regex
const alpha = helpers.regex("alpha", /^([^\u0000-\u007F]|[A-Za-z])+$/);

export default {
  name: "Register",

  mixins: [validationMixin],

  validations: {
    firstName: {required, minLength: minLength(2), alpha},
    lastName: {required, minLength: minLength(2), alpha},
    userName: {required, minLength: minLength(6), maxLength: maxLength(50), alphaNum},
    password: {
      required, minLength: minLength(8), maxLength: maxLength(32),
      containsUppercase: function (value) {
        return /[A-Z]/.test(value)
      },
      containsLowercase: function (value) {
        return /[a-z]/.test(value)
      },
      containsNumber: function (value) {
        return /[0-9]/.test(value)
      },
      containsSpecial: function (value) {
        return /[.#?!@$%^&*-]/.test(value)
      }
    },
    repPassword: {required, sameAsPassword: sameAs('password')},
  },

  data() {
    return {
      showPassword: false,
      showRepPassword: false,
      userName: "",
      firstName: "",
      lastName: "",
      password: "",
      repPassword: "",
      error: null,
    }
  },

  methods: {

    async doRegister() {
      this.$v.$reset()
      this.resetError()
      try {
        await this.$http.post("/register", {
          firstName: this.firstName,
          lastName: this.lastName,
          userName: this.userName,
          password: this.password
        })
      } catch (e) {
        if (e.response.status === 409) {
          this.error = "Uživatelské jméno je již používané"
        } else {
          this.error = e.response.data.error
        }
      } finally {
        if (this.error === null) {
          await this.$router.push({name: "login"})
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
      !this.$v.userName.minLength && errors.push('Minimálně 6 znaků')
      !this.$v.userName.maxLength && errors.push('Maximálně 50 znaků')
      !this.$v.userName.alphaNum && errors.push('Uživatelské jméno nesmí obsahovat speciální znaky nebo diakritiku')

      return errors
    },

    firstNameErrors() {
      const errors = []
      if (!this.$v.firstName.$dirty)
        return errors

      !this.$v.firstName.required && errors.push('*Povinné pole')
      !this.$v.firstName.minLength && errors.push('Minimálně 2 znaky')
      !this.$v.firstName.alpha && errors.push('Jméno neobsahuje čísla ani speciální znaky')

      return errors
    },

    lastNameErrors() {
      const errors = []
      if (!this.$v.lastName.$dirty)
        return errors

      !this.$v.lastName.required && errors.push('*Povinné pole')
      !this.$v.lastName.minLength && errors.push('Minimálně 2 znaky')
      !this.$v.lastName.alpha && errors.push('Příjmení neobsahuje čísla ani speciální znaky')

      return errors
    },

    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty)
        return errors

      !this.$v.password.required && errors.push('*Povinné pole')
      !this.$v.password.minLength && errors.push('Minimálně 8 znaků')
      !this.$v.password.maxLength && errors.push('Maximálně 32 znaků')
      !this.$v.password.containsLowercase && errors.push('Heslo musí obsahovat malé písmeno')
      !this.$v.password.containsUppercase && errors.push('Heslo musí obsahovat velké písmeno')
      !this.$v.password.containsNumber && errors.push('Heslo musí obsahovat číslo')
      !this.$v.password.containsSpecial && errors.push('Heslo musí obsahovat speciální znak')

      return errors
    },

    repPasswordErrors() {
      const errors = []
      if (!this.$v.repPassword.$dirty)
        return errors

      !this.$v.repPassword.required && errors.push('*Povinné pole')
      !this.$v.repPassword.sameAsPassword && errors.push('Hesla se musí shodovat')

      return errors
    },

    hasErrors() {
      return (
          this.userNameErrors.length !== 0
          || this.firstNameErrors.length !== 0
          || this.lastNameErrors.length !== 0
          || this.passwordErrors.length !== 0
          || this.repPasswordErrors.length !== 0
      )
    },

    isFilled() {
      return (!!this.userName && !!this.firstName && !!this.lastName && !!this.password && !!this.repPassword)
    },

    registerButtonDisabled() {
      return (this.hasErrors || !this.isFilled)
    }
  }
}
</script>

<style scoped>

</style>