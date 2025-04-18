<template>
    <AppLayout>
        <template #contentPage>
            <EditClient :accionClient = "accionClient" :isEdit = "isEdit" />
        </template>
    </AppLayout>
</template>

<script setup>
    import AppLayout from '@/layouts/AppLayout.vue'
    import EditClient from '@/components/Clients/EditClient.vue'
    import { ref } from "vue"

    const accionClient = ref('Nuevo');
    const isEdit = ref(false);
</script>