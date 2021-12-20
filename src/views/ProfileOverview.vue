<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3">
        <profile-drawer/>
      </v-col>
      <v-col cols="12" md="9">
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProfileDrawer from "../components/ProfileDrawer";

export default {
  name: "ProfileOverview",
  components: {ProfileDrawer},
}
</script>

<style scoped>

</style>