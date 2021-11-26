<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-form @submit.prevent="doUpdate">
          <v-alert
              dense
              type="info"
              class="mb-10"
          >
            Po změně hesla budete odhlášeni!
          </v-alert>
          <v-text-field
              v-model="oldPassword"
              :type="showOldPassword? 'text': 'password'"
              label="Původní heslo"
              color="primary"
              :error-messages="oldPasswordErrors"
              outlined
              @blur="$v.oldPassword.$touch()"
              :append-icon="showOldPassword? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showOldPassword = !showOldPassword"
          />
          <v-text-field
              v-model="newPassword"
              :type="showNewPassword? 'text': 'password'"
              label="Nové heslo"
              :error-messages="newPasswordErrors"
              color="primary"
              outlined
              :append-icon="showNewPassword? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showNewPassword = !showNewPassword"
              @blur="$v.newPassword.$touch()"
          />
          <v-text-field
              v-model="repNewPassword"
              :type="showRepNewPassword? 'text': 'password'"
              label="Opakovat nové heslo"
              :error-messages="repNewPasswordErrors"
              color="primary"
              outlined
              :append-icon="showRepNewPassword? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showRepNewPassword = !showRepNewPassword"
              @blur="$v.repNewPassword.$touch()"
          />
          <v-dialog
              v-model="dialog"
              persistent
              max-width="30%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  block
                  color="primary"
                  @click="switchDialog"
                  :disabled="saveDisabled"
                  v-bind="attrs"
                  v-on="on"
              >
                Změnit heslo
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5">
                Změnit?
              </v-card-title>
              <v-card-actions>
                <v-btn
                    color="secondary"
                    text
                    @click="switchDialog">
                  Ne
                </v-btn>
                <v-btn
                    color="secondary"
                    text
                    @click="doUpdate">
                  Ano
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-alert v-if="hasServerError"
                   dense
                   outlined
                   type="error"
                   class="my-5">
            {{ this.errorMessage }}
          </v-alert>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {validationMixin} from "vuelidate";
import {maxLength, minLength, required, sameAs} from "vuelidate/lib/validators";

export default {
  name: "PasswordChange",
  mixins: [validationMixin],

  validations: {
    oldPassword: {required},
    newPassword: {
      required, minLength: minLength(8), maxLength: maxLength(32),
      containsUppercase(value) {
        return /[A-Z]/.test(value)
      },
      containsLowercase(value) {
        return /[a-z]/.test(value)
      },
      containsNumber(value) {
        return /[0-9]/.test(value)
      },
      containsSpecial(value) {
        return /[.#?!@$%^&*-]/.test(value)
      }
    },
    repNewPassword: {required, sameAsPassword: sameAs('newPassword')},
  },
  computed: {
    oldPasswordErrors() {
      const errors = []
      if (!this.$v.oldPassword.$dirty)
        return errors

      !this.$v.oldPassword.required && errors.push('*Povinné pole')

      console.log(!this.$v.oldPassword)

      return errors
    },
    newPasswordErrors() {
      const errors = []
      if (!this.$v.newPassword.$dirty)
        return errors

      !this.$v.newPassword.required && errors.push('*Povinné pole')
      !this.$v.newPassword.minLength && errors.push('Minimálně 8 znaků')
      !this.$v.newPassword.maxLength && errors.push('Maximálně 32 znaků')
      !this.$v.newPassword.containsLowercase && errors.push('Heslo musí obsahovat malé písmeno')
      !this.$v.newPassword.containsUppercase && errors.push('Heslo musí obsahovat velké písmeno')
      !this.$v.newPassword.containsNumber && errors.push('Heslo musí obsahovat číslo')
      !this.$v.newPassword.containsSpecial && errors.push('Heslo musí obsahovat speciální znak')

      return errors
    },

    repNewPasswordErrors() {
      const errors = []
      if (!this.$v.repNewPassword.$dirty)
        return errors

      !this.$v.repNewPassword.required && errors.push('*Povinné pole')
      !this.$v.repNewPassword.sameAsPassword && errors.push('Hesla se musí shodovat')

      return errors
    },

    saveDisabled() {
      return this.oldPassword === null || this.newPassword === null || this.repNewPassword === null || this.newPasswordErrors.length !== 0 || this.repNewPasswordErrors.length !== 0
    },

    hasServerError() {
      return this.errorMessage !== null
    },
  },
  data() {
    return {
      oldPassword: null,
      newPassword: null,
      repNewPassword: null,
      dialog: null,
      showOldPassword: false,
      showNewPassword: false,
      showRepNewPassword: false,
      errorMessage: null
    }
  },
  methods: {

    switchDialog() {
      this.dialog = !this.dialog
    },

    async doUpdate() {
      this.$v.$reset()
      try {
        await this.$http.put("/profile/change_password", {
          userName: this.$tokenManager.getUsername(),
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        })
      } catch (e) {
        this.errorMessage = e.response.data.message
      } finally {
        this.switchDialog()
        if (this.errorMessage === null) {
          this.$tokenManager.logout()
          await this.$router.push({name: "login"})
        }
      }
    },
    resetError() {
      this.errorMessage = null
    }
  },
}
</script>