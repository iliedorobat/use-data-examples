import {Contract, HttpParams, HttpPromiseArgs, GenericObject} from '@/hooks/fetch/http.types';

/**
 * Fetch a resource from the network.
 *
 * @param contract - Custom API contract.
 *      E.g.: (uri: string, options?: object) => fetch(uri, options).then(response => response.json());
 * @param endpoint - Target remote address.
 * @param endpointParams - Optional query parameters.
 * @param options - Custom settings applied to the request.
 */
function getPromise({contract, endpoint, endpointParams, options}: HttpPromiseArgs) {
    if (contract) {
        return contract({endpoint, endpointParams, options});
    }

    if (endpoint) {
        const url = prepareUrl(endpoint, endpointParams);
        return fetch(url, options)
            .then(response => response.json());
    }

    return new Promise((resolve, reject) => {
        reject('The contract/endpoint in not valid!');
    });
}

/**
 * Fetch a list of resources from the network.
 *
 * @param contract - Custom API contract.
 *      E.g.: (uri: string, options?: object) => fetch(uri, options).then(response => response.json());
 * @param endpoints - Lis of target remote addresses.
 * @param endpointsParams - List of objects containing optional query parameters.
 * @param options - Custom settings applied to the request.
 */
function bucketFetch(
    contract: Contract | undefined,
    endpoints: Array<string> = [],
    endpointsParams: Array<HttpParams> = [],
    options: RequestInit
) {
    return endpoints.map((endpoint, index) => getPromise({
        contract,
        endpoint,
        endpointParams: endpointsParams[index],
        options
    }));
}

/**
 * Reduce the list of responses to an object having queried URLs
 * as keys and their responses as values.
 *
 * @param urls - List of URLs called.
 * @param responses - List of responses received.
 */
function mergeAllResponses(urls: Array<string> = [], responses: Array<GenericObject>) {
    return responses.reduce((acc, item, index) => {
        const key = urls[index];
        acc[key] = item;

        return acc;
    }, {});
}

/**
 * Reduce the list of settled responses to an object having queried URLs
 * as keys and their responses as values.
 *
 * @param urls - List of URLs called.
 * @param responses - List of responses received.
 */
function mergeAllSettledResponses(urls: Array<string> = [], responses: Array<GenericObject>) {
    return responses.reduce((acc, item, index) => {
        const key = urls[index];
        acc[key] = item.status === 'fulfilled'
            ? item.value
            : {};

        return acc;
    }, {});
}

/**
 * Build a URL based on a specified endpoint and its parameters.
 *
 * @param endpoint - Target remote address.
 * @param endpointParams - Optional query parameters.
 */
function prepareUrl(endpoint: string, endpointParams: HttpParams = {}) {
    const url = new URL(endpoint);
    url.search = new URLSearchParams(endpointParams).toString();
    return url.toString();
}

/**
 * Build a list of URLs based on each specified endpoint and its parameters.
 *
 * @param endpoints - List of target remote addresses.
 * @param endpointsParams - List of query parameters.
 */
function prepareUrls(endpoints: Array<string> = [], endpointsParams: Array<HttpParams> = []) {
    return endpoints.map((endpoint, index) => prepareUrl(endpoint, endpointsParams[index]));
}

export {
    bucketFetch,
    getPromise,
    mergeAllResponses,
    mergeAllSettledResponses,
    prepareUrl,
    prepareUrls
};
