<template>
  <v-container :fill-height="!this.didLoadOffers" fluid>
    <v-row align="center" justify="center" v-if="!this.didLoadOffers">
      <v-progress-circular indeterminate size="100" color="secondary"/>
    </v-row>
    <v-row v-else>
      <v-fade-transition>
        <v-col md="3" cols="12" v-if="this.showFilter">
          <filter-drawer/>
        </v-col>
      </v-fade-transition>
      <v-col>
        <v-container>
          <search-bar ref="search"/>
          <v-row v-if="hasOffers">
            <template v-for="offer in filteredOffers">
              <v-col cols="12" md="6" :key="offer.id">
                <v-hover v-slot="{ hover }">
                  <v-card class="pb-4"
                          height="100%"
                          :elevation="hover ? 12 : 4"
                          :class="{ 'on-hover': hover }">
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
                          <v-card-subtitle>
                            {{ offer['note'] | shorten }}
                          </v-card-subtitle>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-fade-transition>
                      <v-overlay
                          v-if="hover"
                          absolute
                          z-index="0"
                          color="ternary">
                        <v-btn color="quaternary" :to="{ name: 'offerDetail', params: { offerId: offer.id }}">
                          Více informací
                        </v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </v-hover>
              </v-col>
            </template>
          </v-row>
          <v-container v-else>
            <v-row>
              <v-col cols="12" class="text-center">
                <img src="../assets/states/no_data_3.svg" width="50%" alt="No review" class="mb-5">
                <div class="text-h6">Žádná dostupná nabídka.</div>
              </v-col>
            </v-row>
          </v-container>
        </v-container>
      </v-col>
    </v-row>
    <v-row v-if="!this.hasSearched">
      <v-col>
        <v-container>
          <v-row>
            <v-col>
              <a class="text-h4 text--accent-4" @click="scrollToSearch">Pro zobrazení více nabídek specifikujte předmět…</a>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilterDrawer from "../components/FilterDrawer";
import {mapState, mapActions, mapGetters} from 'vuex';
import SearchBar from "../components/SearchBar";

export default {
  name: "Offers",
  components: {SearchBar, FilterDrawer},
  methods: {
    ...mapActions('Offers', ['fetchOffers', 'fetchOffersBySubject']),
    scrollToSearch() {
      window.scrollTo({ top: 0, behavior: 'smooth'});
    }
  },
  computed: {
    ...mapState('Offers', ['offers', 'didLoadOffers', 'showFilter', 'hasSearched']),
    ...mapGetters('Offers', ['getOffers']),
    ...mapGetters('Subjects', ['subject']),

    filteredOffers() {
      return this.getOffers
    },

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
    if (this.subject !== null) {
      await this.fetchOffersBySubject(this.subject.id)
    } else {
      await this.fetchOffers()
    }
  },
}
</script>

<style scoped>

</style>