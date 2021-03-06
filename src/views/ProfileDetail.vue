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
            Po změně údajů budete odhlášeni!
          </v-alert>
          <v-text-field
              v-model="firstName"
              label="Křestní jméno"
              :error-messages="firstNameErrors"
              color="primary"
              outlined
              @blur="$v.firstName.$touch()"
              @input="$v.firstName.$touch()"
              @click="resetError"
          />
          <v-text-field
              v-model="lastName"
              label="Příjmení"
              :error-messages="lastNameErrors"
              color="primary"
              outlined
              @blur="$v.lastName.$touch()"
              @input="$v.lastName.$touch()"
              @click="resetError"
          />
          <v-dialog
              v-model="dialog"
              persistent
              max-width="30%"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  block
                  color="primary"
                  :disabled="!dataHasChanged"
                  @click="switchDialog"
                  v-bind="attrs"
                  v-on="on">
                Uložit změny
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5">
                Změnit?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
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
import {minLength, required} from "vuelidate/lib/validators";
import {uniAlpha} from "../helpers/validators";

export default {
  name: "ProfileDetail",
  mixins: [validationMixin],

  validations: {
    firstName: {required, minLength: minLength(2), uniAlpha},
    lastName: {required, minLength: minLength(2), uniAlpha},
  },
  computed: {

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

    hasServerError() {
      return this.errorMessage !== null
    },

    dataHasChanged() {
      return this.userName !== this.$tokenManager.getUsername() || this.firstName !== this.$tokenManager.getFirstName() || this.lastName !== this.$tokenManager.getLastName()
    }
  },
  data() {
    return {
      firstName: null,
      lastName: null,
      errorMessage: null,
      dialog: false,
    }
  },
  methods: {
    setValues() {
      this.firstName = this.$tokenManager.getFirstName()
      this.lastName = this.$tokenManager.getLastName()
    },

    switchDialog() {
      this.dialog = !this.dialog
    },

    async doUpdate() {
      this.$v.$reset();

      let response;

      try {
        response = await this.$http.put("/profile", {
          id: this.$tokenManager.getUserId(),
          firstName: this.firstName,
          lastName: this.lastName,
        })
      } catch (e) {
        this.errorMessage = e.response.data.message
      } finally {
        this.switchDialog()
        if (this.errorMessage === null) {
          this.$tokenManager.setToken(response.data.token)
        }
      }
    },
    resetError() {
      this.errorMessage = null
    }
  },
  mounted() {
    this.setValues()
  }
}
</script>

<style scoped>

</style>