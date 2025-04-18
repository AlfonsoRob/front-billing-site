<template>
    <AppLayout>
        <template #contentPage>
            <Clients />
        </template>
    </AppLayout>
</template>

<script setup>
    import AppLayout from '@/layouts/AppLayout.vue'
    import Clients from '@/components/Clients/Clients.vue'
</script>