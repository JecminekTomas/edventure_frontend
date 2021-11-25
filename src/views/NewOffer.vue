<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col cols="12" md="4">
        <v-form @submit.prevent="addReview">
          <v-autocomplete
              v-model="university"
              clearable
              label="Univerzita"
              :items="this.universities"
              item-text="name"
              item-value="id"
              @click:clear="clearUniversity"
              @change="clearFaculty"
          />
          <v-autocomplete
              v-model="faculty"
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
              item-text="name"
              item-value="id"
              @click:clear="clearSubject"
          />
          <v-text-field
              v-model="price"
              label="Cena"
              suffix="Kč/h"
              :error-messages="priceErrors"
              @blur="$v.price.$touch()"
              @touch="$v.price.$touch()"
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
            {{ this.errorMessage }}
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
    price: {required, maxValue: maxValue(10000), numeric}
  },
  data() {
    return {
      university: null,
      faculty: null,
      subjectId: null,
      price: null,
      note: "",
      online: false,
      errorMessage: null
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
      !this.$v.price.maxValue && errors.push('Maximální částka je 10.000 Kč/h')
      return errors
    },

    hasSubject() {
      return this.subjectId !== null
    },

    isDisabled() {
      return !(this.hasSubject && this.noteErrors.length === 0 && this.price !== null && this.priceErrors.length === 0)
    },

    hasServerError() {
      return this.errorMessage !== null
    },

    facultyDisabled() {
      return !this.university
    },

    subjectDisabled() {
      return !this.faculty
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
        this.errorMessage = e.response.data.message
      } finally {
        if (this.errorMessage === null) {
          await this.$router.push({name: 'offers'})
        }
      }
    },

    clearUniversity() {
      this.university = null
      this.clearFaculty()
    },

    clearFaculty() {
      this.faculty = null
      this.clearSubject()
    },

    clearSubject() {
      this.subjectId = null
      this.errorMessage = null
    }
  },
  watch: {
    async university() {
      await this.fetchFaculties(this.university.id)
    },
    async faculty() {
      await this.fetchSubjects(this.faculty.id)
    }
  }
}
</script>

<style scoped>

</style>