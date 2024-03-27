<template>
  <div>
    <v-data-iterator :items="flashcards" :items-per-page="10"  v-model:page="page" :search="search">
      <template v-slot:header>
        <v-toolbar color="white">
          <v-text-field v-model="search" density="compact" placeholder="Search" prepend-inner-icon="mdi-magnify"
            variant="outlined" color="white" clearable hide-details ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:default="{ items }">
        <v-container fluid >
          <v-row>
            <v-col v-for="item in items" :key="item.raw.id" cols="12" sm="8" md="6" lg="3">
              <v-card color="indigo" variant="elevated" height="200">
                <v-card-item>
                  <div>
                    <div class="text-overline mb-1">
                      Flash Cards Set
                    </div>
                    <div class="text-h6 mb-1 text-uppercase">
                      {{ item.raw.name }}
                    </div>
                    <div class="text-caption">{{ item.raw.words.length }} words</div>
                  </div>
                </v-card-item>

                <v-card-actions>
                  <v-btn class="ml-2" variant="outlined" :to="`/flash-card/${item.raw.id}`" color="teal-accent-2">
                    <v-icon>mdi-play</v-icon>Start
                  </v-btn>
                </v-card-actions>
              </v-card>

            </v-col>
          </v-row>
        </v-container>
      </template>

      
      <template v-slot:footer="{ pageCount, prevPage, nextPage }">
          
          <v-pagination
          v-model="page"
          :length="pageCount"
          @next="nextPage"
          @prev="prevPage"
        ></v-pagination>
        
      </template>
    </v-data-iterator>
  </div>
  
</template>

<script>
import { setWordsService } from '../services/setWords'


export default {
  data: () => ({
    search: '',
    page: 1,
    flashcards: [],
  }),
  created() {
    this.getAllSets()
  },
  methods: {
    async getAllSets(){
      setWordsService.getAll()
      .then((response) => {
          this.flashcards = response.data
      })
    }
  }
}
</script>