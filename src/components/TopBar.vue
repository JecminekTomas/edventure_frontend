<template>
  <v-container fluid>
    <v-app-bar app>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click.stop="drawer = !drawer"/>

      <v-toolbar-title class="mr-10 ml-2 font-weight-medium text-h5">EDVENTURE</v-toolbar-title>

      <v-toolbar-items class="hidden-md-and-down" v-for="item in menuItems" :key="item.title" :to="item.path">
        <v-btn text>
        <v-icon class="pr-2">
          {{ item.icon }}
        </v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>

      <v-spacer/>

      <v-toolbar-items>
        <v-btn fab x-large elevation="0" class="hidden-md-and-down">
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-title class="font-weight-medium mx-5 hidden-md-and-down">
        Jméno Uživatele
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
    >
      <v-list nav dense>
        <v-list-item-group v-model="group">
          <v-list-item class="text-center">
            <v-list-item-title>Jméno Uživatel</v-list-item-title>
          </v-list-item>

          <v-divider/>

          <v-list-item class="py-4">
            <v-list-item-icon>
              <v-icon>mdi-account-search</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Hledat doučování</v-list-item-title>
          </v-list-item>

          <v-list-item class="pb-4">
            <v-list-item-icon>
              <v-icon>mdi-note-plus-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Nová nabídka</v-list-item-title>
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
      {title: 'Hledat doučování', path: '/home', icon: 'mdi-account-search'},
      {title: 'Nová nabídka', path: '/signup', icon: 'mdi-note-plus-outline'},
    ]
  }),

  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>

<style scoped>

</style>
