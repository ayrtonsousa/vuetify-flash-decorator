<template>
  <v-container>
    <v-row justify="space-around">

      <v-col cols="12" sm="8" md="4" lg="2">
        <CardTotal color="teal" title="Total Hits" :value="totalHits"/>
        <CardTotal color="red" title="Total Errors" :value="totalErrors"/>
      </v-col>

      <v-col cols="auto">
        <DatePicker />
      </v-col>
 
        <v-col cols="12" sm="8" md="4" lg="2" >
          <TableRows />
        </v-col>

      <v-col cols="12">
        <ChartLine />
      </v-col>

    </v-row>
  </v-container>

</template>

<script>
import ChartLine from './ChartLine.vue'
import TableRows from './TableRows.vue'
import DatePicker from './DatePicker.vue'
import CardTotal from './CardTotal.vue'

import { dashboardService } from '../../services/dashboard'

export default {
  components: {
    ChartLine,
    TableRows,
    DatePicker,
    CardTotal
  },
  data() {
    return {
      totalErrors: 0,
      totalHits: 0,
    }
  },
  methods: {
    async getTotalHitsLast30Days() {
      dashboardService.getTotalHitsLast30Days()
      .then((response) => {
        this.totalHits = response.data.hits
        this.totalErrors = response.data.errors
      })
    }
  },
  mounted() {
    this.getTotalHitsLast30Days()
  }
}
</script>

