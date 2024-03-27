<template>
<v-sheet v-if="chartData" :elevation="3" height="250" >
  <Line :options="chartOptions" :data="chartData" />
</v-sheet>
<v-skeleton-loader v-else height="250" width="100%"></v-skeleton-loader>

</template>

<script>
import { dashboardService } from '../../services/dashboard'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)


export default {
  name: 'LineChart',
  components: { Line },
  data() {
    return {
      datasetsAPI: [],
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Performance last 90 days',
            font: {
                size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => value + '%' // Add '%' to ticks
            }
          }
        },

      }
    }
  },
  created(){
    this.getHistoric90daysByUser()
  },
  watch: {
    datasetsAPI: function() {
      this.createChartData();
    }
  },
  methods: {
    async getHistoric90daysByUser() {
      dashboardService.getHistoric90daysByUser()
      .then((response) => {
        this.datasetsAPI = response.data
      })
    },

    async createChartData(){

      const dates = this.datasetsAPI.map(item => item.date);
      const percentHits = this.datasetsAPI.map(item => ((item.hits / (item.hits + item.errors)) * 100).toFixed(2));
      const percentErrors = this.datasetsAPI.map(item => ((item.errors / (item.hits + item.errors)) * 100).toFixed(2));

      this.chartData = {
      labels: dates,
      datasets:[
          {
            label: 'Hits',
            backgroundColor: '#009688',
            borderColor: '#009688',
            data: percentHits,
            tooltip: {
            callbacks: {
              label: function(context) {
                var label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + '%';
                }
                return label;
              }
            }
            }
          },
          {
            label: 'Errors',
            backgroundColor: '#F44336',
            borderColor: '#F44336',
            data: percentErrors,
            tooltip: {
            callbacks: {
              label: function(context) {
                var label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + '%';
                }
                return label;
              }
            }
            }
          }
        ],
    };
    }

  },

}
</script>