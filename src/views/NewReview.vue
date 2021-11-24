<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" md="4">
        <v-form @submit.prevent="addReview">
          <v-card-title>
            Počet hvězd
          </v-card-title>
          <v-rating
              v-model="stars"
              half-increments
              hover
              large
              clearable
              background-color="primary"

          />
          <v-textarea
              class="mt-5"
              v-model="verbalEvaluation"
              :error-messages="verbalEvaluationErrors"
              clearable
              outlined
              @blur="$v.verbalEvaluation.$touch()"
              label="Slovní hodnocení (nepovinné)"
              :counter="512"
          />
          <v-checkbox v-model="anonymous" label="Přejete si zůstat v anonymitě?"/>
          <v-alert v-model="isAnonymous"
                   dense
                   outlined
                   type="error"
                   class="my-5"
          >
            Pokud zvolíte anonymní recenzi, vaši recenzi nebude možné hodnotit.
          </v-alert>
          <v-btn block color="primary" type="submit" :disabled="isDisabled">
            <v-icon>mdi-pencil-plus</v-icon>
            Přidat recenzi
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {maxLength, minLength} from "vuelidate/lib/validators";
import {validationMixin} from "vuelidate";

export default {
  name: "NewReview",

  mixins: [validationMixin],

  validations: {
    verbalEvaluation: {minLength: minLength(32), maxLength: maxLength(512)},
  },
  computed: {
    verbalEvaluationErrors() {
      const errors = []
      if (!this.$v.verbalEvaluation.$dirty)
        return errors


      !this.$v.verbalEvaluation.maxLength && errors.push('Maximální délka je 256 znaků')
      !this.$v.verbalEvaluation.minLength && errors.push('Minimální délka je 32 znaků')
      return errors
    },
    hasStars() {
      return this.stars !== 0
    },
    isDisabled() {
      return !(this.hasStars && this.verbalEvaluationErrors.length === 0)
    },
    isAnonymous() {
      return this.anonymous
    }
  },
  data() {
    return {
      stars: 0,
      verbalEvaluation: "",
      anonymous: false
    }
  },
  methods: {
    async addReview() {
      try {
        await this.$http.post("/reviews", {
          stars: this.stars,
          verbalEvaluation: this.verbalEvaluation,
          anonymous: this.anonymous,
          offerId: this.$route.params.offerId
        })
      } catch (e) {
        this.error = e.response.data.error
      } finally {
        await this.$router.push({name: 'offerDetail', params: {offerId: this.$route.params.offerId}})
      }
    }
  }
}
</script>
