<template>
  <v-app>
    <top-bar v-if="this.$tokenManager.isUserLogged()"/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import TopBar from "./components/TopBar";

export default {
  name: 'App',
  components: {TopBar},
  data: () => ({
    //
  }),
};
</script>

<style>

</style>
