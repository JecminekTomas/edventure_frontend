<template>
  <v-container fluid>
    <v-app-bar app>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click.stop="drawer = !drawer"/>

      <v-toolbar-title class="mr-10 ml-2 font-weight-medium text-h5">EDVENTURE</v-toolbar-title>

      <v-toolbar-items class="hidden-md-and-down" v-for="item in menuItems" :key="item.title">
        <v-btn text :to="{name: item.to}" class="no-background-on-click" active-class="secondary--text" :ripple="false">
          <v-icon class="pr-2">
            {{ item.icon }}
          </v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>

      <v-spacer/>

      <v-toolbar-items>
        <v-btn fab :to="{name: 'profileDetail'}" x-large elevation="0" class="hidden-md-and-down no-background-on-click"
               :ripple="false"
               active-class="secondary--text">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-title class="font-weight-medium mr-2 hidden-md-and-down">
        {{ fullName }}
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
    >
      <v-list nav dense>

        <v-list-item-group color="secondary">
          <v-list-item v-model="group" class="no-background-on-click" :to="{name: 'profileDetail'}">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ fullName }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-divider/>

        <v-list-item-group v-model="group" color="secondary" class="pt-4">
          <v-list-item class="no-background-on-click" v-for="item in menuItems" :to="{name: item.to}" :key="item.title"
                       :ripple="false">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>

      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    menuItems: [
      {title: 'Hledat doučování', to: 'offers', icon: 'mdi-account-search'},
      {title: 'Nová nabídka', to: 'newOffer', icon: 'mdi-note-plus-outline'},
    ]
  }),
  computed: {
    fullName() {
      return `${this.$tokenManager.getLastName()} ${this.$tokenManager.getFirstName()}`
    }
  },

  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>

