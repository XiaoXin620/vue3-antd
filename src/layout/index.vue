<template>
    <Layout style="height: 100vh; ">
        <Layout.Sider v-model:collapsed="collapsed" :width="asiderWidth" collapsible>
            <div class="logo" />
            <AsideMenu />
        </Layout.Sider>
        <Layout>
            <PageHeader />
            <Layout.Content style="margin: 0 16px">
                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <a-button @click="generateRoutes">生成</a-button>
                </div>
            </Layout.Content>
        </Layout>
    </Layout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Layout } from 'ant-design-vue';
import AsideMenu from './menu/menu.vue';
import PageHeader from './header/index.vue'
import { generateDynamicRoutes } from '@/router/helper/routeHelper';
import request from '@/router/helper/permi.json'
import type { RouteRecordRaw } from 'vue-router';
const collapsed = ref<boolean>(false);
// 自定义侧边栏菜单收缩和展开时的宽度
const asiderWidth = computed(() => (collapsed.value ? 80 : 220));
const generateRoutes = () => {
    generateDynamicRoutes(request.menu as unknown as RouteRecordRaw[])
}
</script>
<style scoped>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>