<template>
    <v-toolbar flat class="mb-2">
                <v-toolbar-title>{{ accionClient }} cliente</v-toolbar-title>
            </v-toolbar>
    <v-form v-model="valid" @submit.prevent="saveClient">
        <v-container>
            <v-row>
                <v-col
                cols="12"
                md="4"
                >
                <v-text-field
                    v-model="formData.rfc"
                    :rules="inputTextRules"
                    label="RFC *"
                    required
                ></v-text-field>
                </v-col>

                <v-col
                cols="12"
                md="4"
                >
                <v-text-field
                    v-model="formData.razon_social"
                    :rules="inputTextRules"
                    label="Razón social *"
                    required
                ></v-text-field>
                </v-col>

                <v-col
                cols="12"
                md="4"
                >
                <v-text-field
                    v-model="formData.codPos"
                    :counter="5"
                    :rules="codPosRules"
                    label="Código postal *"
                    required
                ></v-text-field>
                </v-col>

                <v-col
                cols="12"
                md="4"
                >
                <v-text-field
                    v-model="formData.email"
                    :rules="emailRules"
                    label="Correo electrónico *"
                    required
                ></v-text-field>
                </v-col>

                <v-col
                cols="12"
                md="4"
                >
                <v-select
                label="Uso CFDI *"
                :rules="inputTextRules"
                :items="usoCFDI"
                v-model="formData.selected_usoCFDI"
                item-value="value"
                item-text="text"
                required
                ></v-select>
                </v-col>

                <v-col
                cols="12"
                md="4"
                >
                <v-select
                label="Régimen fiscal *"
                :rules="inputTextRules"
                :items="regFiscal"
                v-model="formData.selected_regFiscal"
                required
                ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-btn type="submit" color="primary" class="mt-4">
                        Guardar
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script setup>
    import { ref, reactive } from "vue"
    import axios from 'axios'
    import Swal from 'sweetalert2'
    import { defineProps } from "vue";
    import { useRouter } from "vue-router";

    const router = useRouter()

    const { uidClient, accionClient, isEdit} = defineProps(["uidClient", "accionClient", "isEdit"]);

    const valid = ref(false)
    const formData = reactive({
         rfc : "",
         razon_social : "",
         email : "",
         codPos : "",
         selected_usoCFDI : "",
         selected_regFiscal : "",
    })

    const inputTextRules = reactive([
        value => {
            if (value) return true

            return 'Campo Obligatorio.'
        }
    ])
    const emailRules = reactive([
        value => {
            if (value) return true

            return 'Campo Obligatorio.'
        },
        value => {
            if (/.+@.+\..+/.test(value)) return true

            return 'Correo inválido'
        },
    ])
    const codPosRules = reactive([
        value => {
            if (value) return true

            return 'Campo Obligatorio.'
        },
        value => {
            if (/^[0-9]+$/.test(value)) return true

            return 'Campo numérico'
        },
        value => {
          if (value?.length == 5) return true

          return 'Campo a 5 digitos'
        }
      ])

    const full_usoCFDI = reactive([])
    const full_regFiscal = reactive([])
    const usoCFDI = ref([])
    const regFiscal = ref([])

    const getUsoCFDI = async() => {
        const data = await axios.get("http://127.0.0.1:8008/api/catalogos/uso_cfdi")

        if(data.status == 200 ){
            full_usoCFDI.value = data.data.data
            formatUsoCFDI()
        }
    }

    const formatUsoCFDI = () => {
        const newJson = full_usoCFDI.value.map(uso => {
            return {
                title: uso.name,
                value: uso.key
            };
        });

        usoCFDI.value = newJson
    }

    const getRegFiscal = async() => {
        const data = await axios.get("http://127.0.0.1:8008/api/catalogos/regFiscal")

        if(data.status == 200 ){
            full_regFiscal.value = data.data.data.data
            formatRegFiscal()
        }
    }

    const formatRegFiscal = () => {
        const newJson = full_regFiscal.value.map(regimen => {
            return {
                title: `${regimen.key} - ${regimen.name}`,
                value: regimen.key
            };
        });

        regFiscal.value = newJson
    }

    const getClient = async(uid) => {
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

        const data = await axios.get(`http://127.0.0.1:8008/api/clientes/${uid}/edit`)
        Swal.close();
        if(data.status == 200 ){
            formData.rfc = data.data.Data.RFC
            formData.razon_social = data.data.Data.RazonSocial
            formData.email = data.data.Data.Contacto.Email
            formData.codPos = data.data.Data.CodigoPostal
            formData.selected_usoCFDI = data.data.Data.UsoCFDI
            formData.selected_regFiscal = data.data.Data.RegimenId
        }
    }

    const saveClient = async() => {
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

        let data;
        try {
            if(isEdit){
                data = await axios.put(`http://127.0.0.1:8008/api/clientes/${uidClient}`, formData)
            }else{
                data = await axios.post(`http://127.0.0.1:8008/api/clientes`, formData)
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }

        if(data.status == 200){
            Swal.close()
            Swal.fire({
                icon: "success",
                title:  "Guardado con exito",
                customClass: {
                    confirmButton: 'btnAlert'
                }
            })

            setTimeout(() => { router.push('/clients') }, 2000)

        }else{
            Swal.close()
            Swal.fire({
                icon:   'warning',
                title:  'Ocurrió un error al guardar',
                customClass: {
                    confirmButton: 'btnAlert'
                }
            })
        }
    }

    getUsoCFDI()
    getRegFiscal()

    if(isEdit){
        getClient(uidClient)
    }

</script>

<style>
    .btnAlert{
        color: white;
    }
</style>