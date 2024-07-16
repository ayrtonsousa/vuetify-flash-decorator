<template>
    <v-card-title class="d-flex align-center pe-2">
        Words
        <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
                <v-btn v-if="hasPermission(['create_word'])" class="ml-4" color="blue" v-bind="props">
                    <v-icon>mdi-plus</v-icon>New Word
                </v-btn>
            </template>

            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-form ref="form" v-model="valid" lazy-validation>
                                <v-text-field v-model="editedItem.name" label="Word" variant="outlined" :rules="ruleName"></v-text-field>
                                <v-text-field v-model="editedItem.translation" label="Translation" variant="outlined" :rules="ruleTranslation"></v-text-field>
                                <v-textarea v-model="editedItem.annotation" label="Annotation" variant="outlined"></v-textarea>
                                <v-autocomplete label="Tags" v-model="editedItem.tags" variant="outlined"
                                    :items="this.tags" item-title="name" item-value="id" chips multiple></v-autocomplete>
                                    <v-btn class="my-2" @click="dialogTag = true">
                                        <v-icon>mdi-plus</v-icon>Tags
                                    </v-btn>
                                    <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-darken-1" variant="text" @click="close">
                                        Cancel
                                    </v-btn>
                                    <v-btn color="blue-darken-1" variant="text" @click="save">
                                        Save
                                    </v-btn>
                                </v-card-actions>
                                </v-form>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogTag" max-width="600px">
            <v-card title="Tags">
                <v-card-text>
                    <v-row>
                        <v-col align-self="end">
                            <v-text-field v-model="inputTag" ref="inputTag" label="Tag" variant="outlined"
                                :rules="[v => !!v || 'Tag is required']"></v-text-field>
                            <v-chip v-for="tag in tags" :key="tag.id" class="mr-2 my-2" variant="elevated" closable>
                                {{ tag.name }}
                                <template #close>
                                <v-icon icon="mdi-close-circle" @click.stop="deleteTag(tag.id)" />
                                </template>
                            </v-chip>

                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="blue-darken-1" variant="text" @click="saveTag">
                        Save
                    </v-btn>
                    <v-btn text="Close" variant="text" @click="dialogTag = false, this.inputTag = ''"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogTagDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this tag?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeTagDelete">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteTagConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-spacer></v-spacer>

        <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
            variant="outlined" flat hide-details single-line>
        </v-text-field>

    </v-card-title>

    <v-data-table :headers="headers" :items="words" :sort-by="[{ key: 'word', order: 'asc' }]" :search="search">

        <template v-slot:item.tags="{ value }">
            <v-chip-group>
                <v-chip v-for="tag in value" :key="tag">
                    <v-icon icon="mdi-label" start></v-icon> {{ tag.name }}
                </v-chip>
            </v-chip-group>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-icon v-if="hasPermission(['update_word'])" class="me-2" size="small" @click="editItem(item)">
                mdi-pencil
            </v-icon>
            <v-icon v-if="hasPermission(['delete_word'])" size="small" @click="deleteItem(item)">
                mdi-delete
            </v-icon>
        </template>

        <template v-slot:no-data>
            No data
        </template>
    </v-data-table>
</template>


<script>
import { createToast } from 'mosha-vue-toastify'

import { wordsService } from '../services/words'
import { tagsService } from '../services/tags'

import { useAppStore } from "@/store/app";


export default {
    setup() {
        const appStore = useAppStore();
        const { hasPermission } = appStore;
        return {
            hasPermission
        };
    },
    data: () => ({
        dialog: false,
        dialogTag: false,
        dialogDelete: false,
        dialogTagDelete: false,
        inputTag: '',
        idTagBeforeDelete: null,
        tags: [],
        search: '',
        headers: [
            {
                title: 'Name',
                align: 'start',
                key: 'name',
            },
            { title: 'Translation', key: 'translation' },
            { title: 'Annotations', key: 'annotation' },
            { title: 'Tags', key: 'tags', sortable: false },
            { title: 'teste', key: 'teste', sortable: false },
            { title: 'Actions', key: 'actions', sortable: false },
        ],
        words: [],
        valid: true,
        ruleName: [(v) => !!v || "Name is required"],
        ruleTranslation: [(v) => !!v || "Translation is required"],
        editedIndex: -1,
        editedItem: {
            name: '',
            translation: '',
            annotation: '',
            tags: [],
        },
        defaultItem: {
            name: '',
            translation: '',
            annotation: '',
            tags: [],
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Word' : 'Edit Word'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
        dialogTagDelete(val) {
            val || this.closeTagDelete()
        },
    },

    created() {
        this.initialize()
    },

    methods: {
        async initialize() {
            wordsService.getAll()
            .then((response) => {
                this.words = response.data
                this.words.reverse()
            })
            tagsService.getAll()
            .then((response) => {
                this.tags = response.data
            })
        },
        editItem(item) {
          wordsService.get(item.id)
            .then((response) => {
                const word = response.data
                this.editedIndex = this.words.indexOf(item)
                this.editedItem = Object.assign({}, word)
                this.dialog = true
            })
        },
        deleteItem(item) {
            this.editedIndex = this.words.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            wordsService.remove(this.editedItem.id)
            .then((response) => {
                this.words.splice(this.editedIndex, 1)
                this.closeDelete()
            })   
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        saveTag() {
            if (this.inputTag) {
                tagsService.create({'name':this.inputTag})
                    .then((response) => {
                        const tagCreated = response.data
                        this.tags.push(tagCreated)
                        this.inputTag = ''
                        this.$refs.inputTag.reset()
                }).catch((error)=>{
                    const message = error.response.data.errors.name
                    createToast(message, { type: 'danger', showIcon: true })
                })
            }
        },
        async save() {
            const { valid } = await this.$refs.form.validate();
            if(valid){
                if (this.editedIndex > -1) {
                    wordsService.update(
                        this.editedItem.id,
                        this.editedItem
                    )
                    .then((response) => {
                        this.$refs.form.resetValidation()
                        const wordCreated = response.data
                        this.close()
                        Object.assign(this.words[this.editedIndex], wordCreated)
                    }).catch((error)=>{
                        const fieldName = Object.keys(error.response.data.errors)[0];
                        const errorMessage = error.response.data.errors[fieldName]; 
                        createToast(errorMessage, { type: 'danger' })
                    })
                    
                } else {
                    wordsService.create(this.editedItem)
                    .then((response) => {
                        const wordCreated = response.data
                        this.close()
                        this.words.splice(0, 0, wordCreated);
                    })
                }

            }
        },
        deleteTag(idTag){
            this.dialogTagDelete = true
            this.idTagBeforeDelete = idTag
        },

        deleteTagConfirm() {
            this.closeTagDelete()
            tagsService.remove(this.idTagBeforeDelete)
            .then((response) => {
                const indexTag = this.tags.findIndex(
                    objeto => objeto.id === this.idTagBeforeDelete
                );
                this.tags.splice(indexTag, 1)
                this.closeDelete()
            })
        },
        closeTagDelete() {
            this.dialogTagDelete = false
        },

    },
}
</script>


  