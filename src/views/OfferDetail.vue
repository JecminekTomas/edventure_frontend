<template>
  <v-container :fill-height="!this.didLoadOffers" fluid>
    <v-row align="center" justify="center" v-if="!this.didLoadOffers">
      <v-progress-circular indeterminate size="100" color="secondary"/>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="6">
        <v-container fluid>
          <v-row justify="start" justify-md="space-between">
            <v-col md="5" cols="12">
              <v-card-title>
                {{ `${offer['teacherLastName']} ${offer['teacherFirstName']}` }}
              </v-card-title>
            </v-col>
            <v-col md="5" cols="12">
              <v-card-title class="primary--text justify-start justify-md-end mt-n10 mt-md-0">
                {{ `${offer['price']} Kč/h` }}
              </v-card-title>
            </v-col>
          </v-row>
          <v-row class="mt-n12">
            <v-col>
              <v-card-title v-if="offer['reviewBalance']['starsAverage'] !== 0"
                            class="secondary--text">
                <v-rating class="ml-n1"
                          half-increments
                          hover
                          dense
                          color="secondary"
                          background-color="secondary"
                          readonly
                          :value="offer['reviewBalance']['starsAverage']"
                />
                {{ `(${offer['reviewBalance']['reviewCount']})` }}
              </v-card-title>
              <v-card-title v-else/>
            </v-col>
          </v-row>
          <v-row class="mt-n6">
            <v-col>
              <v-card-title class="primary--text">
                {{ offer['subjectName'] }}
              </v-card-title>
            </v-col>
          </v-row>
          <v-row class="mt-n6">
            <v-col>
              <v-card-subtitle>
                {{ offer['note'] }}
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <v-col cols="12" md="6">
        <v-container>
          <v-row justify="space-between">
            <v-col cols="12" md="5">
              <v-card-title class="pl-10">
                RECENZE
              </v-card-title>
            </v-col>
            <v-col cols="12" md="5">
              <v-card-title class="px-10 d-flex justify-md-end">
                <v-btn color="secondary">
                  Přidat recenzi
                </v-btn>
              </v-card-title>
            </v-col>
          </v-row>
          <v-list>
            <v-list-item
                v-for="review in reviews"
                :key="review['id']">
              <v-list-item-content>
                <v-container>
                  <v-card class="pb-4"
                          elevation="4">
                    <v-container>
                      <v-row justify="start" justify-md="space-between">
                        <v-col cols="12">
                          <v-card-title v-if="review['userFrom']">
                            {{ `od ${review['userFrom']['lastName']} ${review['userFrom']['firstName']}` }}
                          </v-card-title>
                          <v-card-title v-else>
                            {{ "od Anonymního uživatele" }}
                          </v-card-title>
                          <v-card-subtitle class="text--disabled">
                            {{ `Hodnoceno dne ${formattedTimestamp(review)}` }}
                            <br/>
                            {{ `pro předmět ${review['subject']['name']}` }}
                          </v-card-subtitle>
                        </v-col>
                      </v-row>
                      <v-row class="mt-n12">
                        <v-col>
                          <v-card-title>
                            <v-rating
                                half-increments
                                hover
                                dense
                                color="primary"
                                background-color="primary"
                                readonly
                                :value="review['stars']"
                            />
                          </v-card-title>
                        </v-col>
                      </v-row>
                      <v-row class="mt-n6">
                        <v-col>
                          <v-card-subtitle>
                            {{ review['verbalEvaluation'] }}
                          </v-card-subtitle>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6" class="d-flex justify-center">
                          <v-btn icon
                                 class="no-background-on-click"
                                 :ripple="false"
                                 :color="getHelpfulColor(true, review)"
                                 @click="sendHelpful(true, review)">
                            <v-icon>mdi-thumb-up-outline</v-icon>
                            {{ `Užitečné (${review['score']['helpful']})` }}
                          </v-btn>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex justify-center">
                          <v-btn icon
                                 class="no-background-on-click"
                                 :ripple="false"
                                 :color="getHelpfulColor(false, review)">
                            <v-icon>mdi-thumb-down-outline</v-icon>
                            {{ `Neužitečné (${review['score']['unhelpful']})` }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-container>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapState, mapActions} from 'vuex';

export default {
  name: "OfferDetail",
  computed: {
    ...mapState('Offers', ['singleOffer', 'didLoadOffers']),
  },
  data() {
    return {
      offer: null,
      reviews: null
    }
  },
  async created() {
    alert();
    await this.fetchSingleOffer(this.$route.params.offerId)
    this.offer = this.singleOffer.offer
    this.reviews = this.singleOffer.reviews
  },
  methods: {
    ...mapActions('Offers', ['fetchSingleOffer']),
    ...mapActions('Scores', ['postScore']),

    formattedTimestamp(review) {
      const date = new Date(review['reviewTimestamp']);
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear().toString().substr(-2)}`
    },

    async sendHelpful(helpful, review) {
      const score = await this.$http.post('/scores', {helpful: `${helpful}`, reviewId: `${review.id}`})
      const index = this.reviews.findIndex(r => r === review)
      if (score)
        this.reviews[index]['userVoted'] = score
      else
        this.reviews[index]['userVoted'] = null
    },

    getHelpfulColor(helpful, review) {
      if (review['score']['userVoted'] && review['score']['userVoted']['helpful'] === helpful)
        return "primary";
      return "disabled";
    },
  }
}
</script>

<style scoped>

</style>