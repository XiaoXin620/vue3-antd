import { defineStore } from "pinia";
import { ref } from "vue";
import { login as authLogin } from "@/api/auth";
import { accountPermissions } from "@/api/account";

export const useUserStore = defineStore(
    "user", () => {
        const token = ref<string>("");

        const setToken = (_token: string) => {
            token.value = _token;
        };
        const login = async (params: { code: string, username: string, password: string }) => {
            console.log(params);
            try {
                const res = await authLogin(params)
                console.log(res);
                setToken(res.token)
                await afterLogin()
                await fetchPermsAndMenus()
                Promise.resolve(res)
            } catch (error) {
                console.log(error);
                throw error
            }
        }

        const afterLogin = async () => {


        }
        const fetchPermsAndMenus = async () => {
            try {
                const res = await accountPermissions({ token: token.value })
                console.log(res);

            } catch (error) {
                console.log(error);
                throw error
            }
        }
        return {
            login,
            token
        }
    },
    {
        persist: {
            paths: ['token'],
        },
    })