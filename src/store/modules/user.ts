import { defineStore } from "pinia";
import { ref } from "vue";
import { login as authLogin } from "@/api/auth";

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
                Promise.resolve(res)
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