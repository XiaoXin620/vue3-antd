import { request, type RequestOptions } from "@/utils/request";


export async function login(body: { code: string, username: string, password: string }, options?: RequestOptions) {
    return request('/sys/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}