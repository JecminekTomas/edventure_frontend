<template>
  <v-app-bar app>
    <v-app-bar-nav-icon class="hidden-lg-and-up"/>

    <v-toolbar-title class="mr-10 ml-2 font-weight-medium text-h5">EDVENTURE</v-toolbar-title>

    <v-toolbar-items class="hidden-md-and-down">
      <v-btn text plain>
        <v-icon>mdi-account-search</v-icon>
        Hledat doučování
      </v-btn>

      <v-btn text plain>
        <v-icon>mdi-note-plus-outline</v-icon>
        Nová nabídka
      </v-btn>
    </v-toolbar-items>

    <v-spacer/>

    <v-toolbar-items class="hidden-md-and-down">
      <v-btn fab color="ternary" light small elevation="0" dark>
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-btn text plain>
        Jméno uživatele
      </v-btn>
    </v-toolbar-items>

    <v-navigation-drawer
        class="hidden-lg-and-up"
        absolute
        bottom
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title>Foo</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Bar</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Fizz</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Buzz</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar"
}
</script>