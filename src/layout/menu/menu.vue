<template>
    <div>
        <Menu :inline-collapsed="false" :open-keys="openKeys" v-model:selectedKeys="selectedKeys" theme="dark"
            @click="clickMenuItem" mode="inline">
            <a-menu-item key="1">
                <pie-chart-outlined />
                <span>Option 1</span>
            </a-menu-item>
            <a-menu-item key="2">
                <desktop-outlined />
                <span>Option 2</span>
            </a-menu-item>
            <a-sub-menu key="sub1">
                <template #title>
                    <span>
                        <user-outlined />
                        <span>User</span>
                    </span>
                </template>
                <a-menu-item key="3">Tom</a-menu-item>
                <a-menu-item key="4">Bill</a-menu-item>
                <a-menu-item key="5">Alex</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
                <template #title>
                    <span>
                        <team-outlined />
                        <span>Team</span>
                    </span>
                </template>
                <a-menu-item key="6">Team 1</a-menu-item>
                <a-menu-item key="8">Team 2</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="9">
                <file-outlined />
                <span>File</span>
            </a-menu-item>
        </Menu>
    </div>
</template>

<script setup lang="ts">
import {
    PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
    TeamOutlined,
    FileOutlined,
} from '@ant-design/icons-vue';
import { Menu } from 'ant-design-vue'
import { ref } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>([]);

const clickMenuItem = (keys: any) => {
    console.log(keys);
}
</script>

<style scoped></style>
