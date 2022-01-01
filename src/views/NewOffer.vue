<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col cols="12" md="4">
        <v-form @submit.prevent="addReview">
          <v-autocomplete
              v-model="universityId"
              clearable
              label="Univerzita"
              :items="this.universities"
              item-text="name"
              item-value="id"
              @click:clear="clearUniversity"
              @change="clearFaculty"
          />
          <v-autocomplete
              v-model="facultyId"
              clearable
              label="Fakulta"
              :disabled="facultyDisabled"
              :items="this.faculties"
              item-text="name"
              item-value="id"
              @click:clear="clearFaculty"
              @change="clearSubject"
          />
          <v-autocomplete
              v-model="subjectId"
              clearable
              label="Předmět"
              :disabled="subjectDisabled"
              :items="this.subjects"
              :item-text="item => item.code +' - '+ item.name"
              item-value="id"
              @click:clear="clearSubject"
          />
          <v-text-field
              v-model="price"
              label="Cena"
              suffix="Kč/h"
              :error-messages="priceErrors"
              @blur="$v.price.$touch()"
              @input="$v.price.$touch()"
          >

          </v-text-field>
          <v-textarea
              class="mt-5"
              v-model="note"
              :error-messages="noteErrors"
              clearable
              outlined
              @blur="$v.note.$touch()"
              @input="$v.note.$touch()"
              label="Popis (nepovinné)"
              :counter="2048"
          />
          <v-checkbox v-model="online" label="Výuka probíhá online formou"/>
          <v-alert v-if="hasServerError"
                   dense
                   outlined
                   type="error"
                   class="my-5"
          >
            {{ this.error }}
          </v-alert>
          <v-btn block color="primary" type="submit" :disabled="isDisabled">
            <v-icon>mdi-note-plus</v-icon>
            Přidat nabídku
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {validationMixin} from "vuelidate";
import {maxLength, minLength, maxValue, required, numeric} from "vuelidate/lib/validators";
import {mapActions, mapState} from "vuex";

export default {
  name: "NewOffer",
  mixins: [validationMixin],

  validations: {
    note: {minLength: minLength(32), maxLength: maxLength(2048)},
    price: {required, maxValue: maxValue(100000), numeric}
  },
  data() {
    return {
      universityId: null,
      facultyId: null,
      subjectId: null,
      price: null,
      note: "",
      online: false,
      error: null
    }
  },
  async created() {
    await this.fetchUniversities()
  },
  computed: {
    ...mapState('Universities', ['universities']),
    ...mapState('Faculties', ['faculties']),
    ...mapState('Subjects', ['subjects']),

    noteErrors() {
      const errors = []
      if (!this.$v.note.$dirty)
        return errors

      !this.$v.note.maxLength && errors.push('Maximální délka je 256 znaků')
      !this.$v.note.minLength && errors.push('Minimální délka je 32 znaků')

      return errors
    },

    priceErrors() {
      const errors = []
      if (!this.$v.price.$dirty)
        return errors

      !this.$v.price.required && errors.push('*Povinné pole')
      !this.$v.price.numeric && errors.push('Částka musí být číselná hodnota')
      !this.$v.price.maxValue && errors.push('Maximální částka je 100.000 Kč/h')
      return errors
    },

    hasSubject() {
      return this.subjectId !== null
    },

    hasPrice() {
      return this.price !== null
    },

    hasLocalError() {
      return this.noteErrors.length !== 0 || this.priceErrors.length !== 0
    },

    hasServerError() {
      return this.error !== null
    },

    isDisabled() {
      return !(this.hasSubject && this.hasPrice && !this.hasLocalError)
    },

    facultyDisabled() {
      return !this.universityId
    },

    subjectDisabled() {
      return !this.facultyId
    },
  },
  methods: {
    ...mapActions('Universities', ['fetchUniversities']),
    ...mapActions('Faculties', ['fetchFaculties']),
    ...mapActions('Subjects', ['fetchSubjects']),
    async addReview() {
      try {
        await this.$http.post("/offers", {
          subjectId: this.subjectId,
          price: this.price,
          online: this.online,
          note: this.note
        })
      } catch (e) {
        if (e.response.status === 403) {
          this.error = e.response.data.message
        } else {
          this.error = "Nastala chyba"
        }
      } finally {
        if (!this.hasServerError) {
          await this.$router.push({name: 'offers'})
        }
      }
    },

    clearUniversity() {
      this.universityId = null
      this.clearFaculty()
    },

    clearFaculty() {
      this.facultyId = null
      this.clearSubject()
    },

    clearSubject() {
      this.subjectId = null
      this.error = null
    }
  },
  watch: {
    async universityId() {
      await this.fetchFaculties(this.universityId)
    },
    async facultyId() {
      await this.fetchSubjects(this.facultyId)
    }
  }
}
</script>

<style scoped>

</style>