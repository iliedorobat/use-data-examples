export type Contract = (input: ContractArgs) => Promise<any>;

export type ContractArgs = {
    endpoint?: string;
    endpointParams?: HttpParams;
    options?: RequestInit;
};

export type GenericObject = { [key: string]: any; }

type HttpContractArgs = {
    contract: Contract;
    endpoint?: string;
    endpointParams?: HttpParams;
    options?: RequestInit;
};

type HttpFetchArgs = {
    contract?: Contract;
    endpoint: string;
    endpointParams?: HttpParams;
    options?: RequestInit;
};

export type HttpPromiseArgs = HttpContractArgs | HttpFetchArgs;

export type HttpParams = { [key: string]: any; }
