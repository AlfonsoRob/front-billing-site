<template>
    <AppLayout>
        <template #contentPage>
            <EditClient :uidClient = "props.uid" :accionClient = "accionClient" :isEdit = "isEdit" />
        </template>
    </AppLayout>
</template>

<script setup>
    import AppLayout from '@/layouts/AppLayout.vue'
    import EditClient from '@/components/Clients/EditClient.vue'
    import { ref, reactive } from "vue"

    const accionClient = ref('');
    const props = defineProps(['uid'])
    const isEdit = ref(false);

    // Valida si la propiedad "uid" existe y tiene un valor válido
    if (props.uid !== undefined && props.uid !== null) {
        accionClient.value = 'Editar';
        isEdit.value = true;
        //getClient(props.uid)
    } else {
        accionClient.value = 'Crear';
        isEdit.value = false;
    }
</script>