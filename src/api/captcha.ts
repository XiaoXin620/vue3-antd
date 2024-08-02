import { request } from "@/utils/request";


export async function sliverCaptchaByImg() {
    return request('/sys/createImage', {
        method: 'GET',
    })
}


export function verifyCaptchaCodeAndWith(params: { code: string, width: number }) {
    return request('/sys/verifyImage', {
        method: 'POST',
        params
    })
}