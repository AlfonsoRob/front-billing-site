<template>
    <AppLayout>
        <template #contentPage>
            <Invoices />
        </template>
    </AppLayout>
</template>

<script setup>
    import AppLayout from '@/layouts/AppLayout.vue'
    import Invoices from '@/components/Invoices/Invoices.vue'
</script>