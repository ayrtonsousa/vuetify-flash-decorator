<template>
  <v-carousel v-model="stepWord" v-if="flashcards.length" height="350" progress="indigo" hide-delimiters :continuous="false" @update:modelValue="this.inputWord = ''">
    <v-carousel-item v-for="(flashcard, index) in flashcards" :key="index">

      <v-card color="indigo" class="mx-auto my-8" max-width="700" height="300">
        <v-card-text>
          <p class="text-h3 text-capitalize d-flex align-center flex-column">
            {{ flashcard.name }}
          </p>
          <v-text-field class="my-6" v-model="inputWord" label="Type in portuguese" variant="outlined" hide-details
          v-on:keyup.enter=" this.inputWord ? checkWord(flashcard.translation, inputWord, flashcard.id) : false "
          :id="`id-${index}`"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions class="mr-2 ml-2">
          <v-btn size="x-large" :disabled="flashcard.answered" block variant="flat" color="grey-lighten-3"
            @click="checkWord(flashcard.translation, inputWord, flashcard.id)">Submit</v-btn>
        </v-card-actions>

        <v-expand-transition>
          <v-card v-if="flashcard.answered" class="mx-auto v-card--reveal d-flex align-center flex-column" height="300"
            :color="flashcard.hit ? 'teal' : 'red'" elevation="12">
            <v-row class="align-center">
              <v-col>
                <div class="text-h3 text-capitalize">
                  {{ flashcard.translation }}
                </div>
                <v-col class="text-h4 text-center">
                  <v-icon :icon="flashcard.hit ? 'mdi-checkbox-marked-circle' : 'mdi-close-circle-outline'"></v-icon></v-col>
              </v-col>
            </v-row>
          </v-card>
        </v-expand-transition>
      </v-card>
    </v-carousel-item>

    <v-carousel-item :key="flashcards.length">
      <v-card class="mx-auto my-8" max-width="700" height="300" @click="finishQuiz()"
            color="teal" elevation="12">
            <v-row class="align-center">
              <v-col>
                <div class="text-h3 text-capitalize d-flex align-center flex-column my-12">
                  Do you want to finish ?
                  <div class="my-4">
                    <v-icon icon="mdi-checkbox-marked-circle"></v-icon>
                  </div>
                </div>
                  
              </v-col>
            </v-row>
      </v-card>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import { createToast } from 'mosha-vue-toastify'
import router from '@/router'

import { setWordsService } from '../services/setWords'
import { dashboardService } from '../services/dashboard'

export default {
  data() {
    return {
      inputWord: '',
      flashcards: [],
      idSet: this.$route.params.id,
      stepWord: 0
    }
  },
  watch: {
    stepWord: function() {
      setTimeout(() => {
        const field = document.getElementById(`id-${this.stepWord}`);
        if(field){
          field.focus();
        }
      }, 200);
      
    }
  },
  methods: {
    checkWord(translation, inputWord, idWord) {
      const flashcard = this.flashcards.find(word => word.id === idWord);
      flashcard.hit = (translation.toLowerCase() == inputWord.toLowerCase())
      flashcard.answered = true
      this.inputWord = ''
      setTimeout(() => {
        this.stepWord += this.flashcards.length == this.stepWord ? 0 : 1 
      }, 700);
    },
    finishQuiz(){
      let hits = 0
      let errors = 0
      let historic = []
      let result = null

      this.flashcards.forEach(flashcard => {
          if(flashcard.hit){
            hits += 1
            result = true
          }else{
            errors += 1
            result = false
          }
          historic.push(
            {"id_word": flashcard.id, "hit": result}
          )

      });

      dashboardService.createHistoric({'historics':historic}).
      then((response)=>{
          if(hits > 0){
            createToast(
            `${hits} Hits`,
              { type: 'success', showIcon: true, timeout: 5000 }
            )
          }
          if(errors > 0){
            createToast(
            `${errors} Errors`,
              { type: 'warning', showIcon: true, timeout: 5000 }
            )
          }
      
      }).catch((error)=>{
        createToast(
          `Error when saving`,
            { type: 'danger', showIcon: true, timeout: 5000 }
          )
      })

      router.push('/flash-cards');

  }
  },
  created() {
    setWordsService.getWordsBySet(this.idSet).
    then((response)=>{
      this.flashcards = response.data
      this.flashcards.forEach(flashcard => {
        flashcard.answered = null;
        flashcard.hit = null;
    });
    })
  },
};
</script>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>