<template>
    <v-card-title class="d-flex align-center pe-2">
            Sets
        <v-dialog v-model="dialog" max-width="900px">
            <template v-slot:activator="{ props }">
                <v-btn v-if="hasPermission(['create_set_words'])" class="ml-4" color="blue"  v-bind="props">
                    <v-icon>mdi-plus</v-icon>New Set
                </v-btn>
            </template>

            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col >
                                <v-form ref="form" v-model="valid" lazy-validation>
                                <v-text-field v-model="editedItem.name" label="Name" variant="outlined" :rules="ruleName">
                                </v-text-field>
                                <v-autocomplete
                                    v-model="editedItem.words"
                                    label="Words"
                                    :items="words"
                                    item-title="name"
                                    item-value="id"
                                    multiple chips variant="outlined"
                                    :rules="ruleWords"
                                    :custom-filter="customFilter"
                                >
                                <template v-slot:chip="{ props, item }">
                                    <v-chip
                                    v-bind="props"
                                    :text="item.raw.name"
                                    ></v-chip>
                                </template>

                                <template v-slot:item="{ props, item }">
                                    <v-list-item
                                    v-bind="props"
                                    :subtitle="item.raw.tags.map(tag => tag.name).join(', ')"
                                    :title="item.raw.name"
                                    ></v-list-item>
                                </template>
                            </v-autocomplete>
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
        <v-spacer></v-spacer>

        <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
            variant="outlined" flat hide-details single-line>
        </v-text-field>

    </v-card-title>

    <v-data-table :headers="headers" :items="sets" :sort-by="[{ key: 'word', order: 'asc' }]" :search="search">

        <template v-slot:item.actions="{ item }">
            <v-icon v-if="hasPermission(['update_set_words'])" class="me-2" size="small" @click="editItem(item)">
                mdi-pencil
            </v-icon>
            <v-icon v-if="hasPermission(['delete_set_words'])" size="small" @click="deleteItem(item)">
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

import { setWordsService } from '../services/setWords'
import { wordsService } from '../services/words'

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
        dialogDelete: false,
        search: '',
        headers: [
            {
                title: 'Set',
                align: 'start',
                key: 'name',
            },
            { title: 'Actions', key: 'actions', sortable: false },
        ],
        sets: [],
        words: [],
        editedIndex: -1,
        editedItem: {
            name: '',
        },
        defaultItem: {
            name: '',
        },
        valid: true,
        ruleName: [(v) => !!v || "Name is required"],
        ruleWords: [(v) => !!v || "Words is required"],
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Set' : 'Edit Set'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.initialize()
    },

    methods: {
        async initialize() {
            setWordsService.getAll()
            .then((response) => {
                this.sets = response.data
            })
            wordsService.getAll()
            .then((response) => {
                this.words = response.data
            })
        },

        editItem(item) {
          setWordsService.get(item.id)
            .then((response) => {
                const set = response.data
                this.editedIndex = this.sets.indexOf(item)
                this.editedItem = Object.assign({}, set)
                this.dialog = true
            })
        },

        deleteItem(item) {
            this.editedIndex = this.sets.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            setWordsService.remove(this.editedItem.id)
            .then((response) => {
                this.sets.splice(this.editedIndex, 1)
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

        async save() {
            const { valid } = await this.$refs.form.validate();
            if(valid){
                if (this.editedIndex > -1) {
                    setWordsService.update(
                        this.editedItem.id,
                        this.editedItem
                    )
                    .then((response) => {
                        this.$refs.form.resetValidation()
                        const setCreated = response.data
                        this.close()
                        Object.assign(this.sets[this.editedIndex], setCreated)
                    }).catch((error)=>{
                        const fieldName = Object.keys(error.response.data.errors)[0];
                        const errorMessage = error.response.data.errors[fieldName]; 
                        createToast(errorMessage, { type: 'danger', showIcon: true })
                    })
                    
                } else {
                    setWordsService.create(this.editedItem)
                    .then((response) => {
                        const setCreated = response.data
                        this.close()
                        this.sets.push(setCreated)
                    })
                }

            }
        },

        customFilter (itemTitle, queryText, item) {
            const textOne = item.raw.name.toLowerCase()
            const textTwo = item.raw.tags.map(tag => tag.name).join(', ').toLowerCase()
            const searchText = queryText.toLowerCase()

            return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
        },
    },
}
</script>