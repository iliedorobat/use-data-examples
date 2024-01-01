export type DataHookInput = {
    endpoint: string;
    id?: string;
    initialData?: any;
    initialLoading?: boolean;
};

export type AllDataHookInput = {
    endpoints: Array<string>;
    id?: string;
    initialData?: any;
    initialLoading?: boolean;
};

export enum RESULT_TYPES {
    ERROR = 'error',
    SUCCESS = 'success'
}
