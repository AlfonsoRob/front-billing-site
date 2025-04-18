<template>
    <v-app>
        <v-app-bar app>
            <v-btn icon @click="drawer = !drawer">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-app-bar-title>Factura.com</v-app-bar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app>
            <v-list>
                <v-list-item>
                    <router-link :to="{ name: 'AddInvoice'}" class="cursor-pointer hover-link no-decoration">
                        <v-list-item-title>Crear factura</v-list-item-title>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link :to="{ name: 'Invoices'}" class="cursor-pointer hover-link no-decoration">
                        <v-list-item-title>Facturas</v-list-item-title>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link :to="{ name: 'AddClient'}" class="cursor-pointer hover-link no-decoration">
                        <v-list-item-title>Crear cliente</v-list-item-title>
                    </router-link>
                </v-list-item>
                <v-list-item>
                    <router-link :to="{ name: 'Clients'}" class="cursor-pointer hover-link no-decoration">
                        <v-list-item-title>Clientes</v-list-item-title>
                    </router-link>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container>
                <slot name="contentPage"></slot>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { useDisplay } from "vuetify";

    const drawer = ref(false);
    const { smAndDown } = useDisplay();

    onMounted(() => {
      if (smAndDown.value) {
        drawer.value = false; 
      } else {
        drawer.value = true;
      }
    });
</script>

<style>
    .no-decoration {
        text-decoration: none;
        color: inherit;
    }

    .hover-link {
        position: relative;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .hover-link:hover {
        color: #007bff; /* Cambia el color del texto al hacer hover */
    }

    .hover-link::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 0%;
        height: 2px;
        background-color: #007bff; /* Línea de color azul */
        transition: width 0.4s ease;
    }

    .hover-link:hover::after {
        width: 100%; /* La línea se expande al hacer hover */
    }
</style>