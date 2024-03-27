<template>
    <v-card-title class="d-flex align-center pe-2">
            Users
        <v-dialog v-model="dialog" max-width="900px">

            <v-card>
                <v-card-title>
                    <span class="text-h5">Edit Roles User</span>
                </v-card-title>

                <v-card-item>
                
                                <div class="text-h6">
                                    User
                                </div>
                                <div class="mb-4">
                                    {{ editedItem.name }}
                                </div>
                                <v-autocomplete
                                    label="Roles"
                                    v-model="editedItem.roles" variant="outlined"
                                    :items="this.roles" item-title="name" item-value="id"
                                    multiple chips
                                ></v-autocomplete>
                                <v-checkbox
                                label="Admin ?"
                                v-model="editedItem.is_admin"
                                hint="Admin users does not need to have roles checked"
                                persistent-hint
                                ></v-checkbox>
                           
                </v-card-item>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close">
                        Cancel
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="save">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this user?</v-card-title>
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

    <v-data-table :headers="headers" :items="users" :sort-by="[{ key: 'name', order: 'asc' }]" :search="search" >

        <template v-slot:item.is_admin="{ item }">
            {{item.is_admin ? 'Yes' : 'No'  }}
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="editItem(item)">
                mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item)">
                mdi-delete
            </v-icon>
        </template>
        <template v-slot:no-data>
            No data
        </template>
    </v-data-table>
</template>


<script>
import { userService } from '../services/user'
import { createToast } from 'mosha-vue-toastify'

export default {
    data: () => ({
        users: [],
        roles: [],
        dialog: false,
        dialogDelete: false,
        search: '',
        headers: [
            {title: 'User', align: 'start', key: 'name'},
            {title: 'Email', align: 'start', key: 'email'},
            {title: 'Admin', align: 'start', key: 'is_admin'},
            {title: 'Actions', key: 'actions', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
            is_admin: false,
            roles: ''
        },
        defaultItem: {
            is_admin: false,
            roles: '',
        },
    }),

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
        initialize() {
            userService.getAll()
            .then((response) => {
                this.users = response.data
            })

            userService.getAllRoles()
            .then((response) => {
                this.roles = response.data
            })

        },

        editItem(item) {
            userService.get(item.id)
            .then((response) => {
                const user = response.data
                this.editedIndex = this.users.indexOf(item)
                this.editedItem = Object.assign({}, user)
                this.dialog = true
            })
        },

        deleteItem(item) {
            this.editedIndex = this.users.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            userService.remove(this.editedItem.id)
            .then((response) => {
                this.users.splice(this.editedIndex, 1)
                this.closeDelete()
            }).catch((error) =>{
                const errorMessage = error.response.data.message; 
                createToast(errorMessage, { type: 'danger', showIcon: true })
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
            userService.updateRoles(
                this.editedItem.id,
                {
                    'roles': this.editedItem.roles,
                    'is_admin': this.editedItem.is_admin,
                }
                )
            .then((response) => {
                const userData = response.data
                this.close()
                Object.assign(this.users[this.editedIndex], userData)
            }).catch((error)=>{
                const fieldName = Object.keys(error.response.data.errors)[0];
                const errorMessage = error.response.data.errors[fieldName]; 
                createToast(errorMessage, { type: 'danger' })
            })                 
            
        },
    },
}
</script>