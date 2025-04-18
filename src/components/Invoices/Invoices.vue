<template>
    <v-app>
        <v-container>
            <v-toolbar flat class="mb-2">
                <v-toolbar-title>Listado de facturas</v-toolbar-title>
            </v-toolbar>
            
            <v-data-table
                :items="items"
                class="elevation-1"
            >
                <!-- Encabezados manuales -->
                <template v-slot:headers>
                    <tr>
                        <th>UID</th>
                        <th>Tipo documento</th>
                        <th>Folio</th>
                        <th>Serie</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        <th>Estatus</th>
                        <th>Opciones</th>
                    </tr>
                </template>

                <!-- Filas de datos -->
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.uid }}</td>
                        <td></td>
                        <td>{{ item.folio }}</td>
                        <td></td>
                        <td>{{ item.total }}</td>
                        <td>{{ item.fecha_timbrado }}</td>
                        <td>{{ item.estatus }}</td>
                        <td>
                            <v-btn icon @click="sendMail(item.uid)">
                                <v-icon>mdi-email</v-icon>
                            </v-btn>
                            <v-btn icon @click="cancelInvoice(item.uid)">
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

    const full_items = ref([]);
    const items = ref([]);

    const getInvoices = async() => {
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
        })

        const {data} = await axios.get("http://127.0.0.1:8008/api/facturas")

        Swal.close()
        if(data.data.length > 0){
            full_items.value = data.data
            formatListInvoices()
        }
    }

    const formatListInvoices = () => {
        const newJson = full_items.value.map(invoice => {
            return {
                uid: invoice.UID,
                folio: invoice.Folio,
                total: invoice.Total,
                fecha_timbrado: invoice.FechaTimbrado,
                estatus: invoice.Status
            }
        });

        items.value = newJson
    }

    getInvoices()

    const askReason = async() => {
        const result = await Swal.fire({
            title: 'Selecciona una opción',
            html: `
                <select id="selectOptionCancel" class="swal2-select" style="width:80%; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="01">Comprobante emitido con errores con relación</option>
                    <option value="02">Comprobante emitido con errores sin relación</option>
                    <option value="03">No se llevó a cabo la operación</option>
                    <option value="04">Operación nominativa relacionada en la factura global</option>
                </select>
                <input type="text" id="folioRelacion" class="swal2-input" style="width:80%; border: 1px solid #ccc; border-radius: 4px;" placeholder="Folio relación (solo para la opción 1)">
            `,
            confirmButtonText: 'Continuar',
            customClass: {
                confirmButton: 'btnAlert'
            },
            focusConfirm: false,
            preConfirm: () => {
                const selectedOption = document.getElementById('selectOptionCancel').value;
                const folioRelacion = document.getElementById('folioRelacion').value;

                if (selectedOption === '01' && !folioRelacion) {
                    Swal.showValidationMessage('Debes ingresar un folio que reemplazara al cancelado');
                }

                return { selectedOption, folioRelacion };
            }
        });

        if (result.isConfirmed) {
            return result.value;
        }

        return null;
    };

    const cancelInvoice = async(uid) => {
        const resultReason = await askReason();

        if (resultReason) {
            Swal.fire({
                icon: 'info',
                title: 'Cancelando factura...',
                text: 'No recargue ni cierre esta ventana',
                allowEscapeKey: false,
                allowOutsideClick: false,
                showConfirmButton: false,
                customClass: {
                    popup: 'custom-popup',
                    icon: 'kt-animate-shake'
                }
            })

            const { selectedOption, folioRelacion } = resultReason;
            const payload = {
                motivo : selectedOption,
                folio_sustituto : folioRelacion
            }

            const { data } = await axios.delete(`http://127.0.0.1:8008/api/facturas/${uid}`, {params: payload})

            Swal.close()
            if(data.response == 'success'){
                Swal.fire({
                    icon: "success",
                    title:  'Respuesta Exitosa',
                    text:  data.message,
                    customClass: {
                        confirmButton: 'btnAlert'
                    }
                })

                setTimeout(() => { getInvoices() }, 2500)
            }else{
                Swal.fire({
                    icon:   'warning',
                    title:  'Advertencia',
                    text:  data.message,
                    customClass: {
                        confirmButton: 'btnAlert'
                    }
                })
            }
        }
    }

    const sendMail = async(uid) => {
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

        const data = await axios.get(`http://127.0.0.1:8008/api/facturas/${uid}/enviarMail`)

        Swal.close()
        if(data.status == 200){
            if(data.data.response == 'success'){
                Swal.fire({
                    icon: "success",
                    title: "Respuesta exitosa",
                    text:  data.data.message,
                    customClass: {
                        confirmButton: 'btnAlert'
                    }
                })
            }else{
                Swal.fire({
                icon:   'warning',
                title: "Advertencia",
                text:  data.data.message,
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