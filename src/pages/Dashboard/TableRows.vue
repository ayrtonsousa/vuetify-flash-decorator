<template>
        <v-card elevation="3" min-width="350" >
        <v-card-title class="text-center" >
            Top 10 errors
        </v-card-title>
        <v-card-subtitle class="text-center" >
          All the time until yesterday
        </v-card-subtitle>
        <v-card-item>
            <v-table density="compact" fixed-header>
            <thead>
                <tr>
                <th class="text-left">
                    #
                </th>
                <th class="text-left">
                    Word
                </th>
                <th class="text-left">
                    Total
                </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in wordsTopErrors" :key="item.name">
                <td>{{ index + 1 }}</td>
                <td>{{ item.word }}</td>
                <td>{{ item.count }}</td>
                </tr>
            </tbody>
            </v-table>
        </v-card-item>
        </v-card>
</template>

<script>

import { dashboardService } from '../../services/dashboard'


export default {
    data() {
    return {
      wordsTopErrors: []
    }
    },
    methods: {
    async getTop10WrongWordsByUser() {
      dashboardService.getTop10WrongWordsByUser()
      .then((response) => {
        this.wordsTopErrors = response.data
      })
    }
    },
  mounted() {
        this.getTop10WrongWordsByUser()
    }

}

</script>

<style scoped>
.table-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>