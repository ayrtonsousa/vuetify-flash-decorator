<template>
        <v-card class="my-4" :title="title" subtitle="Last 30 days" height="150" max-width="300" :color="color" elevation="3">
          <v-card-text class="py-4 text-h2" justify="center" no-gutters>
            {{ value }}
          </v-card-text>
        </v-card>
</template>

<script>
export default {
  props: ["title","color","value"]
}
</script>