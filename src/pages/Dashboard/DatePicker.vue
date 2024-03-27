<template>

<div v-if="dataAPI" >
    <v-date-picker color="indigo" elevation="3" v-model="dates" :min="dateMin" :max="dateMax"
      title="Access in the last 90 days" @update:modelValue="reloadDays" height="500" width="600">
    </v-date-picker>
</div>
<v-skeleton-loader v-else height="500" width="600"></v-skeleton-loader>

  <div v-if="dialog" class="text-center">
    <v-dialog v-model="dialog" v-if="dialog" width="auto">
      <v-card max-width="400" prepend-icon="mdi-update" title="Historic on day">
        <v-card-title class="text-center">
          {{ this.dateDialog }}
        </v-card-title>
        <v-card-text>

          <v-table>
            <thead>
              <tr>
                <th class="text-left">
                  Hits
                </th>
                <th class="text-left">
                  Errors
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ hitsDay }}</td>
                <td>{{ errorsDay }}</td>
              </tr>

            </tbody>
          </v-table>

        </v-card-text>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="close" @click="this.dialog = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import { dashboardService } from '../../services/dashboard'

export default {
    data() {
      return {
        dialog: false,
        dates: null,
        defaultDates: [],
        dateDialog: null,
        dateMin: null,
        dateMax: null,
        dataAPI: null,
        hitsDay: null,
        errorsDay: null,
      }
    },
    watch: {
      dataAPI: function() {
        this.createDataPicker();
      }
    },
    created() {
      this.getHistoric90daysByUser()
     
    },
    mounted(){

    },
    methods: {
      reloadDays(selectedDate) {
        this.dates = this.defaultDates
        const dateExists = this.dates.some(date => date.getTime() === selectedDate.getTime());
        if (dateExists) {
          const dateSelected = new Date(selectedDate).toISOString().split('T')[0]
          this.boxDialog(dateSelected)
        }
      },
      createDataPicker(){
        const datesAPI = this.dataAPI.map(item => this.$vuetify.date.parseISO((item.date)));

        this.dateMin = datesAPI[0]
        this.dateMax = datesAPI[datesAPI.length-1]

        this.defaultDates = datesAPI
        this.dates = datesAPI
      },
      boxDialog(selectedDate) {
        this.dialog = true
        const item = this.dataAPI.find(item => item.date === selectedDate);
        this.dateDialog = selectedDate
        this.hitsDay = item.hits
        this.errorsDay = item.errors
      },
      async getHistoric90daysByUser() {
        dashboardService.getHistoric90daysByUser()
        .then((response) => {
          this.dataAPI = response.data
        })
      }
    }
  }
  </script>