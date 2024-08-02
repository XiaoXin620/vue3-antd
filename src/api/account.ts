import { request, type RequestOptions } from "@/utils/request";

export async function accountPermissions(params: { token: string }, options?: RequestOptions) {
    return request<string[]>('/sys/permission/getUserPermissionByToken', {
        method: 'GET',
        params,
        ...(options || {}),
    });
}