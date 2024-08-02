import './assets/main.css'

import { createApp } from 'vue'

// Antd
import 'ant-design-vue/dist/reset.css';
//unocss
import 'virtual:uno.css'

import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
