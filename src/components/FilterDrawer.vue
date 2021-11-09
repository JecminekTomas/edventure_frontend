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
        <v-text-field label="od"/>
      </v-col>
      <v-col>
        <v-text-field label="do"/>
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
            half-increments
            hover
            size="30"
            dense
            color="primary"
            background-color="primary"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-checkbox label="ONLINE"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="primary" block>
          Aplikovat
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "FilterDrawer",
  data() {
    return {
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
      stateIndex: 0,
      activeButtonIndex: null
    }
  },
  methods: {
    switchButtonState(buttonIndex) {
      if (this.activeButtonIndex !== null) {
        this.buttons[this.activeButtonIndex]['color'] = null
        this.buttons[this.activeButtonIndex]['icon'] = null
      }

      if (this.activeButtonIndex !== buttonIndex)
        this.stateIndex = 0

      this.stateIndex = ++this.stateIndex % 3;
      this.activeButtonIndex = buttonIndex

      this.buttons[buttonIndex]['icon'] = this.states[this.stateIndex]['icon']
      this.buttons[buttonIndex]['color'] = this.states[this.stateIndex]['color']
    }
  }
}
</script>

<style scoped>

</style>