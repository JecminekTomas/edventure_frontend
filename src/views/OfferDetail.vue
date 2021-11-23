<template>
  <v-container :fill-height="!this.didLoadOffer" fluid>
    <v-row align="center" justify="center" v-if="!this.didLoadOffer">
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
                <v-btn color="secondary" :disabled="alreadyReviewed">
                  {{ addReviewButtonText }}
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
                                 :color="getThumbColor(true, review)"
                                 :disabled="isThumbDisabled(review)"
                                 @click="sendHelpful(true, review)">
                            <v-icon>mdi-thumb-up-outline</v-icon>
                            {{ `Užitečné (${getThumbUpCount(true, review)})` }}
                          </v-btn>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex justify-center">
                          <v-btn icon
                                 class="no-background-on-click"
                                 :ripple="false"
                                 :color="getThumbColor(false, review)"
                                 :disabled="isThumbDisabled(review)"
                                 @click="sendHelpful(false, review)">
                            <v-icon>mdi-thumb-down-outline</v-icon>
                            {{ `Neužitečné (${review['scoreBalance']['unhelpfulCount']})` }}
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
import {mapActions, mapState} from 'vuex';

export default {
  name: "OfferDetail",
  computed: {
    ...mapState('OfferDetail', ['offerDetail', 'didLoadOffer']),
    alreadyReviewed() {
      const offer = this.offerDetail['reviews'].find(r => r['userFrom']['id'] === this.$tokenManager.getUserId())
      if (offer) {
        return this.offerDetail['reviews'].find(r => r['userFrom']['id'] === this.$tokenManager.getUserId())['subjectId'] !== this.offerDetail['offer']['subjectId']
      }
      return false
    },
    addReviewButtonText() {
      if (this.alreadyReviewed) return "Tuto nabídku jste již ohodnotil"
      return "Přidat recenzi"
    },
    offer() {
      return this.offerDetail['offer']
    },
    reviews() {
      return this.offerDetail['reviews']
    }
  },
  data() {
    return {}
  },
  async created() {
    await this.fetchOffer(this.$route.params.offerId)
  },

  methods: {
    ...mapActions('OfferDetail', ['fetchOffer']),

    formattedTimestamp(review) {
      const date = new Date(review['reviewTimestamp']);
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear().toString().substr(-2)}`
    },

    async sendHelpful(helpful, review) {
      const index = this.offerDetail['reviews'].findIndex(r => r === review);

      if (!this.offerDetail['reviews'][index]['scoreBalance']['userVote']) {
        await this.createNewScore(helpful, review, index);
      } else if (this.offerDetail['reviews'][index]['scoreBalance']['userVote']['helpful'] === helpful) {
        await this.deleteScore(helpful, review, index);
      } else {
        await this.updateScore(helpful, review, index);
      }
    },

    async createNewScore(helpful, review, index) {
      let response = await this.$http.post('/scores', {
        helpful: `${helpful}`,
        reviewId: `${review.id}`
      })
      this.offerDetail['reviews'][index]['scoreBalance']['userVote']['helpful'] = response.data['helpful'];

      if (helpful === true) {
        this.offerDetail['reviews'][index]['scoreBalance']['helpfulCount']++;
      } else {
        this.offerDetail['reviews'][index]['scoreBalance']['unhelpfulCount']++;
      }
    },

    async deleteScore(helpful, review, index) {
      let response = await this.$http.get('/scores', {
        params: {
          userId: this.$tokenManager.getUserId(),
          reviewId: review.id
        }
      })
      let score = response.data;

      await this.$http.delete(`/scores/${score['id']}`);
      this.offerDetail['reviews'][index]['scoreBalance']['userVote'] = null;
      if (helpful === true) {
        this.offerDetail['reviews'][index]['scoreBalance']['helpfulCount']--;
      } else {
        this.offerDetail['reviews'][index]['scoreBalance']['unhelpfulCount']--;
      }
    },

    async updateScore(helpful, review, index) {
      let getResponse = await this.$http.get('/scores', {
        params: {
          userId: this.$tokenManager.getUserId(),
          reviewId: review.id
        }
      })
      let oldScore = getResponse.data;

      let updateResponse = await this.$http.put(`/scores/${oldScore.id}`, {
        helpful: `${helpful}`,
        reviewId: `${review.id}`
      })

      this.offerDetail['reviews'][index]['scoreBalance']['userVote']['helpful'] = updateResponse.data['helpful'];

      if (helpful === true) {
        this.offerDetail['reviews'][index]['scoreBalance']['helpfulCount']++;
        this.offerDetail['reviews'][index]['scoreBalance']['unhelpfulCount']--;
      } else {
        this.offerDetail['reviews'][index]['scoreBalance']['helpfulCount']--;
        this.offerDetail['reviews'][index]['scoreBalance']['unhelpfulCount']++;
      }
    },

    getThumbUpCount(helpful, review) {
      if (helpful === true) return this.offerDetail['reviews'].find(r => r === review)['scoreBalance']['helpfulCount']
      if (helpful === false) return this.offerDetail['reviews'].find(r => r === review)['scoreBalance']['unhelpfulCount']
    },

    getThumbColor(helpful, review) {
      if (review['scoreBalance']['userVote'] && review['scoreBalance']['userVote']['helpful'] === helpful)
        return "primary";
      else if (review['userFrom'] && review['userFrom']['id'] === this.$tokenManager.getUserId())
        return "disabled";
      return "black";
    },

    isThumbDisabled(review) {
      return review['userFrom'] && review['userFrom']['id'] === this.$tokenManager.getUserId()
    },
  }
}
</script>

<style scoped>

</style>