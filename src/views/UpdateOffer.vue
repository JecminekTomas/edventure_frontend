<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col cols="12" md="8">
        <v-form @submit.prevent="updateOffer">
          <v-autocomplete
              :label="universityName"
              disabled
          />
          <v-autocomplete
              :label="facultyName"
              disabled
          />
          <v-autocomplete
              :label="subjectName"
              disabled
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
              v-model="note"
              class="mt-5"
              :error-messages="noteErrors"
              clearable
              outlined
              @blur="$v.note.$touch()"
              @input="$v.note.$touch()"
              label="Popis (nepovinné)"
              :counter="2048"
          />
          <v-checkbox
              v-model="online"
              label="Výuka probíhá online formou"/>
          <v-alert v-if="hasServerError"
                   dense
                   outlined
                   type="error"
                   class="my-5">
            {{ this.errorMessage }}
          </v-alert>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <v-btn block color="primary" type="submit" :disabled="isDisabled">
                  <v-icon>mdi-note-edit</v-icon>
                  Upravit nabídku
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn block color="quaternary" dark @click="this.deleteOffer">
                  <v-icon>mdi-note-minus</v-icon>
                  Smazat nabídku
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import {validationMixin} from "vuelidate";
import {maxLength, maxValue, minLength, numeric, required} from "vuelidate/lib/validators";
import {mapActions, mapState} from "vuex";

export default {
  name: "UpdateOffer",
  mixins: [validationMixin],

  validations: {
    note: {minLength: minLength(32), maxLength: maxLength(2048)},
    price: {required, maxValue: maxValue(100000), numeric}
  },
  data() {
    return {
      price: null,
      note: null,
      online: null,
      errorMessage: null
    }
  },

  async created() {
    await this.fetchOffersById(this.$route.params.offerId)
    await this.fetchSubjectById(this.offer.subjectId)
    await this.fetchFacultyById(this.subject.facultyId)
    await this.fetchUniversityById(this.faculty.universityId)
    this.setData()
  },

  computed: {
    ...mapState('Universities', ['university']),
    ...mapState('Faculties', ['faculty']),
    ...mapState('Subjects', ['subject']),

    ...mapState('Offers', ['offer']),

    universityName() {
      return this.university?.name
    },

    facultyName() {
      return this.faculty?.name
    },

    subjectName() {
      return this.subject?.name
    },

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

    dataHasChanged() {
      return this.offer.online !== this.online || this.offer.note !== this.note || this.offer.price !== Number(this.price)
    },

    isDisabled() {
      return !this.dataHasChanged || !(this.noteErrors.length === 0 && this.price !== null && this.priceErrors.length === 0)
    },

    hasServerError() {
      return this.errorMessage !== null
    },
  },
  methods: {
    ...mapActions('Universities', ['fetchUniversityById']),
    ...mapActions('Faculties', ['fetchFacultyById']),
    ...mapActions('Subjects', ['fetchSubjectById']),
    ...mapActions('Offers', ['fetchOffersById']),

    setData() {
      this.price = this.offer.price
      this.note = this.offer.note
      this.online = this.offer.online
    },

    async updateOffer() {
      try {
        await this.$http.put(`/offers/${this.$route.params.offerId}`, {
          subjectId: this.offer.subjectId,
          price: this.price,
          online: this.online,
          note: this.note
        })
      } catch (e) {
        this.errorMessage = e.response.data.message
      } finally {
        if (this.errorMessage === null) {
          await this.$router.push({name: 'offersFromUser'})
        }
      }
    },
    async deleteOffer() {
      try {
        await this.$http.delete(`/offers/${this.$route.params.offerId}`)
      } catch (e) {
        this.errorMessage = e.response.data.message
      } finally {
        if (this.errorMessage === null) {
          await this.$router.push({name: 'offersFromUser'})
        }
      }
    },
  }
}
</script>

<style scoped>

</style>