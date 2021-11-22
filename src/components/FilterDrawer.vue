<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h6">Řadit dle</div>
      </v-col>
    </v-row>
    <template v-for="(button, index) in buttons">
      <v-row :key="button.label" class="my-n4">
        <v-col>
          <v-btn block small outlined @click="switchButtonState(index)" :color="button.color">
            <v-icon>{{ button.icon }}</v-icon>
            {{ button.label }}
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col>
        <div class="text-h6">Cena</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="priceFrom" label="od"/>
      </v-col>
      <v-col>
        <v-text-field v-model="priceTo" label="do"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-h6">Minimální hodnocení</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-rating
            v-model="minStars"
            half-increments
            hover
            size="30"
            dense
            clearable
            color="primary"
            background-color="primary"
        />
      </v-col>
    </v-row>
    <!--    <v-row>-->
    <!--      <v-col>-->
    <!--        <v-checkbox v-model="online" label="ONLINE"/>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <v-row>
      <v-col>
        <v-btn color="primary" block :disabled="applyFilterDisabled" @click="setRequirements">
          Aplikovat
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "FilterDrawer",
  data() {
    return {
      priceFrom: null,
      priceTo: null,
      minStars: null,

      states: [
        {icon: null, color: 'black'},
        {icon: 'mdi-arrow-up', color: 'primary'},
        {icon: 'mdi-arrow-down', color: 'primary'}
      ],

      buttons: [
        {
          label: 'ceny',
          icon: null,
          color: null
        },
        {
          label: 'hodnocení',
          icon: null,
          color: null
        },
        {
          label: 'počtu hodnocení',
          icon: null,
          color: null
        }
      ],

      activeButtonStateIndex: 0,
      activeButtonIndex: null
    }
  },
  computed: {
    applyFilterDisabled() {
      return !this.priceFrom && !this.priceTo && !this.minStars && this.activeButtonStateIndex === 0
    }
  },
  methods: {
    ...mapActions('Offers', ['setPriceFromFilter', 'setPriceToFilter', 'setMinStarsFilter', 'setPriceSort', 'setStarsSort', 'setStarsCountSort']),

    switchButtonState(buttonIndex) {
      if (this.activeButtonIndex !== null) {
        this.buttons[this.activeButtonIndex]['color'] = null
        this.buttons[this.activeButtonIndex]['icon'] = null
      }

      if (this.activeButtonIndex !== buttonIndex)
        this.activeButtonStateIndex = 0

      this.activeButtonStateIndex = ++this.activeButtonStateIndex % 3;
      this.activeButtonIndex = buttonIndex

      this.buttons[buttonIndex]['icon'] = this.states[this.activeButtonStateIndex]['icon']
      this.buttons[buttonIndex]['color'] = this.states[this.activeButtonStateIndex]['color']
    },

    setRequirements() {
      this.setSort()
      this.setFilters()
    },

    setSort() {
      this.setPriceSort(null)
      this.setStarsSort(null)
      this.setStarsCountSort(null)

      if (this.activeButtonIndex === 0)
        this.setPriceSort(this.activeButtonStateIndex)

      else if (this.activeButtonIndex === 1)
        this.setStarsSort(this.activeButtonStateIndex)

      else if (this.activeButtonStateIndex === 2)
        this.setStarsCountSort(this.activeButtonStateIndex)
    },

    setFilters() {
      this.setPriceFromFilter(this.priceFrom)
      this.setPriceToFilter(this.priceTo)
      this.setMinStarsFilter(this.minStars)
    }
  }
}
</script>

<style scoped>

</style>