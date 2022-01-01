<template>
  <v-container :fill-height="!this.didLoadOffers" fluid>
    <v-row align="center" justify="center" v-if="!this.didLoadOffers">
      <v-progress-circular indeterminate size="100" color="secondary"/>
    </v-row>
    <v-row v-else justify="center">
      <v-col cols="12" xl="8">
        <v-list v-if="hasOffers">
          <v-list-item
              v-for="offer in offers"
              :key="offer['id']">
            <v-list-item-content>
              <v-container>
                <v-hover v-slot="{ hover }">
                  <v-card class="pb-4"
                          :elevation="hover ? 12 : 4"
                          :class="{ 'on-hover': hover }">
                    <v-container>
                      <v-row justify="start" justify-md="space-between">
                        <v-col md="5" cols="12">
                          <v-card-title>
                            {{ offer['subjectName'] }}
                          </v-card-title>
                          <v-card-subtitle>
                            {{ offer['subjectCode'] }}
                          </v-card-subtitle>
                        </v-col>
                        <v-col md="5" cols="12">
                          <v-card-title class="primary--text justify-start justify-md-end mt-n10 mt-md-0">
                            {{ `${offer['price']} Kč/h` }}
                          </v-card-title>
                        </v-col>
                      </v-row>
                      <v-row class="mt-n6">
                        <v-col>
                          <v-card-subtitle v-if="offer['note'] !== ''">
                            {{ offer['note'] | shorten }}
                          </v-card-subtitle>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-fade-transition>
                      <v-overlay
                          v-if="hover"
                          absolute
                          color="ternary">
                        <v-btn color="quaternary" :to="{name: 'updateOffer', params: {offerId: offer.id}}">
                          Upravit nabídku
                        </v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </v-hover>
              </v-container>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-container v-else>
          <v-row>
            <v-col cols="12" class="text-center">
              <img src="../assets/states/no_offers.svg" width="50%" alt="No review" class="mb-5">
              <div class="text-h6">Dosud jste nevytvořil žádnou nabídku.</div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "OffersFromUser",
  methods: {
    ...mapActions('Offers', ['fetchOffersByOwner', 'setOffer']),

  },
  computed: {
    ...mapState('Offers', ['offers', 'didLoadOffers']),

    hasOffers() {
      return this.offers.length !== 0
    }
  },
  filters: {
    shorten(text) {
      if (!text || text.length <= 255) return text;
      return text.substring(0, 255 - 3) + '...';
    }
  },
  async created() {
    await this.fetchOffersByOwner(this.$tokenManager.getUserId())
  },
}
</script>

<style scoped>

</style>