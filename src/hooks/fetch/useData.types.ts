import {Contract} from '@/hooks/fetch/http.types';

export type DataArgs = {
    contract?: Contract,
    deps?: Array<any>;
    endpoint: string;
    endpointParams?: object;
    debugId?: string;
    initialData?: any;
    initialLoading?: boolean;
};

export type AllDataArgs = {
    contract?: Contract,
    deps?: Array<any>;
    endpoints: Array<string>;
    endpointsParams?: Array<object>;
    debugId?: string;
    initialData?: any;
    initialLoading?: boolean;
};

export enum RESULT_TYPES {
    ERROR = 'error',
    SUCCESS = 'success'
}
