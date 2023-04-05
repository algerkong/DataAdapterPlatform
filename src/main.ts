import { createApp } from 'vue';

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

import { store } from './store';
import router from './router';
import '@/style/index.less';
import '@/style/main.css';
import './permission';
import App from './App.vue';

const app = createApp(App);

app.use(TDesign);
app.use(store);
app.use(router);
app.use(VXETable);
app.mount('#app');
