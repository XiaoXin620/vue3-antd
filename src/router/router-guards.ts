import type { Router } from "vue-router";
import { useUserStore } from '@/store/modules/user';
const LOGIN_NAME = 'Login';
const whiteNameList = [LOGIN_NAME]

export function createRouterGuards(router: Router) {

    router.beforeEach((to, from, next) => {
        const userStore = useUserStore();
        // console.log('beforeEach', to, from)
        if (userStore.token) {
            next()
        } else {
            if (whiteNameList.some(n => n === to.name)) {
                next()
            } else {
                console.log("login");
                next({ name: "Login", query: { redirect: to.fullPath }, replace: true });
            }
        }
    })
}