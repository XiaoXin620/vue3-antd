<template>
    <div class="login-box">
        <div class="login-logo">
            <!-- <svg-icon name="logo" :size="45" /> -->
            <!-- <img src="~@/assets/images/logo.png" width="45" /> -->
            <h1 class="mb-0 ml-2 text-3xl font-bold">后台管理</h1>
        </div>
        <a-form layout="horizontal" :model="loginFormModel" @submit.prevent="handleSubmit" v-show="showLoginForm">
            <a-form-item>
                <a-input v-model:value="loginFormModel.username" size="large" placeholder="admin">
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input v-model:value="loginFormModel.password" size="large" type="password" placeholder="a123456"
                    autocomplete="new-password">
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" size="large" block>
                    登录
                </a-button>
            </a-form-item>
        </a-form>

        <LoginSliverCaptcha v-show="!showLoginForm" ref="loginSliverCaptchaRef"
            @parentHandleSubmit="parentHandleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { message, Modal } from 'ant-design-vue';
import { useUserStore } from '@/store/modules/user';
import LoginSliverCaptcha from './components/login-sliver-captcha.vue';
import { verifyCaptchaCodeAndWith } from '@/api/captcha';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const showLoginForm = ref(true);
const loginSliverCaptchaRef = ref();
const loginFormModel = ref({
    username: 'yangxy',
    password: 'x7008900',
    code: ''
});

const updateCaptcha = async () => {
    // const data = await Api.captcha.captchaCaptchaByImg({ width: 100, height: 50 });
    // captcha.value = data.img;
    // loginFormModel.value.captchaId = data.id;
};
updateCaptcha();

const parentHandleSubmit = async ({ code, width }: { code: string, width: number }) => {
    message.loading('登录中...', 0);
    try {
        await verifyCaptchaCodeAndWith({ code, width })
        message.success('登录成功！')
        loginSliverCaptchaRef.value.onSuccess()
        loginFormModel.value.code = code
        handleLogin()
    } catch (error) {
        loginSliverCaptchaRef.value.onFail()
        console.log(error);
        Modal.error({
            title: () => '提示',
            content: () => "error.message",
        });
    }
    message.destroy();

}

const handleLogin = async () => {
    try {
        await userStore.login(loginFormModel.value)
        console.log("login success");
        setTimeout(() => router.replace((route.query.redirect as string) || '/'));
    } catch (error) {
        showLoginForm.value = true;
    }
}

const handleSubmit = async () => {
    const { username, password } = loginFormModel.value;
    if (username.trim() == '' || password.trim() == '') {
        return message.warning('用户名或密码不能为空！');
    }
    showLoginForm.value = false
    loginSliverCaptchaRef.value.initCodeImg()
    console.log(loginFormModel.value);
};
</script>

<style lang="less" scoped>
.login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding-top: 240px;
    // background: url('@/assets/login.svg');
    background-size: 100%;

    .login-logo {
        display: flex;
        align-items: center;
        margin-bottom: 30px;

        .svg-icon {
            font-size: 48px;
        }
    }

    :deep(.ant-form) {
        width: 400px;

        .ant-col {
            width: 100%;
        }

        .ant-form-item-label {
            padding-right: 6px;
        }
    }
}
</style>