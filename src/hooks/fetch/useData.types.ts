export type ContractType = (uri: string, options?: RequestInit) => Promise<any>;

export type DataInputType = {
    contract?: ContractType,
    deps?: Array<any>;
    endpoint: string;
    id?: string;
    initialData?: any;
    initialLoading?: boolean;
};

export type AllDataInputType = {
    contract?: ContractType,
    deps?: Array<any>;
    endpoints: Array<string>;
    id?: string;
    initialData?: any;
    initialLoading?: boolean;
};

export enum RESULT_TYPES {
    ERROR = 'error',
    SUCCESS = 'success'
}
