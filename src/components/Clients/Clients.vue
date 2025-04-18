<template>
    <v-app>
        <v-container>
            <v-toolbar flat class="mb-2">
                <v-toolbar-title>Listado de clientes</v-toolbar-title>
            </v-toolbar>
            
            <v-data-table
                :items="items"
                class="elevation-1"
            >
                <!-- Encabezados manuales -->
                <template v-slot:headers>
                    <tr>
                        <th>UID</th>
                        <th>Razón social</th>
                        <th>RFC</th>
                        <th>Código postal</th>
                        <th>Opciones</th>
                    </tr>
                </template>

                <!-- Filas de datos -->
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.uid }}</td>
                        <td>{{ item.razon_social }}</td>
                        <td>{{ item.rfc }}</td>
                        <td>{{ item.cp }}</td>
                        <td>
                            <router-link :to="{ name: 'EditClient', params: { uid: item.uid } }" class="cursor-pointer no-decoration">
                                <v-icon>mdi-pencil</v-icon>
                            </router-link>
                            <v-btn icon @click="deleteItem(item.uid)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-container>
    </v-app>
</template>

<script setup>
    import { ref, reactive } from "vue"
    import axios from 'axios'
    import Swal from 'sweetalert2';

    const items = ref([]);

    const getClients = async() => {
        Swal.fire({
            icon: 'info',
            title: 'Cargando...',
            text: 'No recargue ni cierre esta ventana',
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            customClass: {
                popup: 'custom-popup',
                icon: 'kt-animate-shake'
            }
        });

        const {data} = await axios.get("http://127.0.0.1:8008/api/clientes")

        Swal.close()
        if(data.data.length > 0){
            items.value = data.data
        }
    }

    getClients()

    const deleteItem = async(uid) => {
        const data = await axios.delete(`http://127.0.0.1:8008/api/clientes/${uid}`)

        if(data.status == 200){
            if(data.data.data.response == 'success'){
                Swal.fire({
                    icon: "success",
                    title: "Respuesta exitosa",
                    text:  data.data.data.message,
                    customClass: {
                        confirmButton: 'btnAlert'
                    }
                })

                getClients()
            }else{
                Swal.fire({
                icon:   'warning',
                title: "Advertencia",
                text:  data.data.data.message,
                customClass: {
                    confirmButton: 'btnAlert'
                }
            })
            }
        }else{
            Swal.fire({
                icon:   'warning',
                title:  'Error en la peticion',
                customClass: {
                    confirmButton: 'btnAlert'
                }
            })
        }
    }
</script>

<style>
    .btnAlert{
        color: white;
    }
</style>