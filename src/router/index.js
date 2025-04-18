import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Invoices', component: () => import('@/views/Invoices/ViewListInvoices.vue') },
  { path: '/add_invoice', name: 'AddInvoice', component: () => import('@/views/Invoices/ViewAddInvoice.vue') },

  { path: '/clients/edit/:uid', name: 'EditClient', component: () => import('@/views/Clients/ViewEditClient.vue'), props: true },
  { path: '/clients/add_client', name: 'AddClient', component: () => import('@/views/Clients/ViewAddClient.vue')},
  { path: '/clients', name: 'Clients', component: () => import('@/views/Clients/ViewListClients.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
