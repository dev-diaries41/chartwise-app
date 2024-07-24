export interface APIResponse<T> {
    data: T;
    message?: string;
}

export interface ChartWiseAPIResponse<T> extends APIResponse<T> {
    token?: string;
}
