<template>
    <AppLayout>
        <template #contentPage>
            <AddInvoice />
        </template>
    </AppLayout>
</template>

<script setup>
    import AppLayout from '@/layouts/AppLayout.vue'
    import AddInvoice from '@/components/Invoices/AddInvoice.vue'
</script>