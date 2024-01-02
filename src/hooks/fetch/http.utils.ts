import {HttpParamsType, ObjectType} from '@/hooks/fetch/http.types';
import {ContractType} from '@/hooks/fetch/useData.types';

/**
 * Fetch a list of URLs.
 * @param contract - Custom contract.
 *      E.g.: (uri: string, options?: object) => fetch(uri, options).then(response => response.json());
 * @param endpoints - Lis of target remote addresses.
 * @param abortController - AbortController instance.
 */
function bucketFetch(
    contract: ContractType,
    endpoints: Array<string> = [],
    abortController: RequestInit
) {
    const signal = abortController?.signal || undefined;

    return endpoints.map(endpoint => contract(endpoint, {signal}));
}

/**
 * Reduce the list of responses to an object having queried URLs
 * as keys and their responses as values.
 * @param urls - List of URLs called.
 * @param responses - List of responses received.
 */
function mergeAllResponses(urls: Array<string> = [], responses: Array<ObjectType>) {
    return responses.reduce((acc, item, index) => {
        const key = urls[index];
        acc[key] = item;

        return acc;
    }, {});
}

/**
 * Reduce the list of responses to an object having queried URLs
 * as keys and their responses as values.
 * @param urls - List of URLs called.
 * @param responses - List of responses received.
 */
function mergeAllSettledResponses(urls: Array<string> = [], responses: Array<ObjectType>) {
    return responses.reduce((acc, item, index) => {
        const key = urls[index];
        acc[key] = item.status === 'fulfilled'
            ? item.value
            : {};

        return acc;
    }, {});
}

/**
 * Create a URL based on the specified endpoint and its parameters.
 * @param endpoint - Target remote address.
 * @param params - Optional query parameters.
 */
function prepareUrl(endpoint: string, params: HttpParamsType = {}) {
    const url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();
    return url.toString();
}

export {
    bucketFetch,
    mergeAllResponses,
    mergeAllSettledResponses,
    prepareUrl
};
