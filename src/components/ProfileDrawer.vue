<template>
  <v-list flat>

    <v-list-item :to="{name: 'profileDetail'}" color="secondary">
      <v-list-item-icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-list-item-icon>
      <v-list-item-title>PROFIL</v-list-item-title>
    </v-list-item>

    <v-list-group
        :value="false"
        prepend-icon="mdi-comment-quote-outline"
        color="black"
    >
      <template v-slot:activator>
        <v-list-item-title>RECENZE</v-list-item-title>
      </template>

      <v-list-item :to="{name: 'reviewsFromMe'}" color="secondary">
        <v-list-item-content>
          <v-list-item-title>MOJE RECENZE</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item :to="{name: 'reviewsToMe'}" color="secondary">
        <v-list-item-content>
          <v-list-item-title>RECENZE O MNĚ</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>

    <v-list-item :to="{name: 'offersFromMe'}" color="secondary">
      <v-list-item-icon>
        <v-icon>mdi-note-multiple-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-title>MOJE NABÍDKY</v-list-item-title>
    </v-list-item>

    <v-list-item :to="{name: 'passwordChange'}" color="secondary">
      <v-list-item-icon>
        <v-icon>mdi-key-alert-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-title>ZMĚNA HESLA</v-list-item-title>
    </v-list-item>

    <v-dialog
        v-model="dialog"
        persistent
        max-width="300px"
        :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-list-item v-bind="attrs" v-on="on" color="secondary">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>ODHLÁSIT SE</v-list-item-title>
        </v-list-item>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          Odhlásit?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="secondary"
              text
              @click="switchDialog">
            Ne
          </v-btn>
          <v-btn
              color="secondary"
              text
              @click="doLogout"
          >
            Ano
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-list-item class="d-md-none d-md-none">
      <v-btn block elevation="0" @click="switchMenu()">
        <v-icon>{{ menuChevron }}</v-icon>
        Nabídka
      </v-btn>
    </v-list-item>
  </v-list>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ProfileDrawer",
  data() {
    return {
      priceFrom: null,
      priceTo: null,
      minStars: null,
      buttonClicked: false,
      dialog: false,
      menu: false,

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
    },

    hasMenu() {
      return this.menu === true
    },

    //TODO
    menuChevron() {
      if (!this.hasMenu)
        return 'mdi-chevron-up'
      return 'mdi-chevron-down'
    }
  },
  methods: {
    ...mapActions('Offers', ['setPriceFromFilter', 'setPriceToFilter', 'setMinStarsFilter', 'setPriceSort', 'setStarsSort', 'setStarsCountSort']),

    switchDialog() {
      this.dialog = !this.dialog
    },

    switchMenu() {
      this.menu = !this.menu
    },

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
    },

    async doLogout() {
      this.$tokenManager.logout()
      await this.$router.push({name: "login"})
    }
  }
}
</script>