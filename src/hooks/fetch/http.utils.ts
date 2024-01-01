type Params = { [key: string]: any; }

export type GenericObject = { [key: string]: any; }

/**
 * Create a URL based on the specified endpoint and its parameters.
 * @param endpoint - Target remote address.
 * @param params - Optional query parameters.
 */
function prepareUrl(endpoint: string, params: Params = {}) {
    const url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();
    return url.toString();
}

/**
 * Fetch a list of URLs.
 * @param urls - List of URLs called.
 * @param abortController - AbortController instance.
 */
function bucketFetch(urls: Array<string> = [], abortController: RequestInit) {
    return urls.map(
        url => fetch(url, abortController)
            .then(response => response.json())
    );
}

/**
 * Reduce the list of responses to an object having queried URLs
 * as keys and their responses as values.
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
 * Reduce the list of responses to an object having queried URLs
 * as keys and their responses as values.
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

export {
    bucketFetch,
    mergeAllResponses,
    mergeAllSettledResponses,
    prepareUrl
};
