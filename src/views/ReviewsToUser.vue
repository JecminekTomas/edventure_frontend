<template>
  <v-container :fill-height="!this.didLoadReviews" fluid>
    <v-row align="center" justify="center" v-if="!this.didLoadReviews">
      <v-progress-circular indeterminate size="100" color="secondary"/>
    </v-row>
    <v-row v-else justify="center">
      <v-col cols="12" md="8">
        <v-list>
          <v-list-item
              v-for="review in reviews"
              :key="review['id']">
            <v-list-item-content>
              <v-container>
                <v-card class="pb-4"
                        elevation="4"
                >
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
                               disabled>
                          <v-icon>mdi-thumb-up-outline</v-icon>
                          {{ `Užitečné (${getThumbUpCount(true, review)})` }}
                        </v-btn>
                      </v-col>
                      <v-col cols="12" md="6" class="d-flex justify-center">
                        <v-btn icon
                               disabled>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
  name: "ReviewsToUser",
  computed: {
    ...mapState('Reviews', ['reviews', 'didLoadReviews'])
  },
  async created() {
    await this.fetchReviewsTo(this.$tokenManager.getUserId())
  },
  methods: {
    ...mapActions('Reviews', ['fetchReviewsTo']),

    formattedTimestamp(review) {
      const date = new Date(review['reviewTimestamp']);
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear().toString()}`
    },

    getThumbUpCount(helpful, review) {
      if (helpful === true) return this.reviews.find(r => r === review)['scoreBalance']['helpfulCount']
      if (helpful === false) return this.reviews.find(r => r === review)['scoreBalance']['unhelpfulCount']
    },
  },
}
</script>

<style scoped>

</style>