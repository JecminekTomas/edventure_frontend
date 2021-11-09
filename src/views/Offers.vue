<template>
  <v-container>
    <v-row>
      <v-col cols="1" align-self="center">
        <v-btn color="secondary" block>
          <v-icon>mdi-filter-variant</v-icon>
          Filtrovat
        </v-btn>
      </v-col>
      <v-col>
        <v-autocomplete label="Univerzita"/>
      </v-col>
      <v-col>
        <v-autocomplete label="Fakulta"/>
      </v-col>
      <v-col>
        <v-autocomplete label="Předmět"/>
      </v-col>
      <v-col align-self="center">
        <v-btn color="primary" block>
          <v-icon>mdi-magnify</v-icon>
          Vyhledat
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-autocomplete label="Univerzita"/>
      </v-col>
      <v-col>
        <v-autocomplete label="Fakulta"/>
      </v-col>
      <v-col>
        <v-autocomplete label="Předmět"/>
      </v-col>
    </v-row>
    <v-row justify="start">
      <template v-for="offer in offers">
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
                    <v-card-subtitle v-if="offer['reviewBalance']['starsAverage'] !== null" class="secondary--text">
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
                    </v-card-subtitle>
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
                    color="ternary">
                  <v-btn color="quaternary">Více informací</v-btn>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
    <v-row align="end" justify="center">
      <v-col align-self="end">
        <v-pagination :length="6"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Offers",
  data() {
    return {
      offers: []
    }
  },
  async created() {
    const response = await this.$http.get('/offers');
    this.offers = response.data;
  },
  filters: {
    shorten(text) {
      if (!text || text.length <= 255) return text;
      return text.substring(0, 255 - 3) + '...';
    }
  }
}
</script>

<style scoped>

</style>