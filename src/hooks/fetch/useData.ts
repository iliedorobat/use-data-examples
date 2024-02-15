import {useEffect, useState} from 'react';

import {AllDataArgs, DataArgs, RESULT_TYPES} from '@/hooks/fetch/useData.types';
import {
    bucketFetch,
    getPromise,
    mergeAllResponses,
    mergeAllSettledResponses,
    prepareUrl,
    prepareUrls
} from '@/hooks/fetch/http.utils';
import {CustomAbortedError} from '@/hooks/fetch/errors';

/**
 * Read the value of a Promise.
 *
 * @param contract - Promise used to fetch data. If not present, the <b>fetch</b> API is used instead.
 * @param debugId - Instance identifier used to log a debug message. If not present, no message will be display.
 * @param deps - List of optional dependencies used to trigger a new fetch.
 * @param endpoint - Target remote address.
 * @param endpointParams - Query parameters.
 * @param initialData - Initial state.
 */
function useData({
    contract,
    debugId,
    deps = [],
    endpoint,
    endpointParams,
    initialData = {}
}: DataArgs) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const abortController = new AbortController();
    const {signal} = abortController;
    const setExternalData = (externalData: DataArgs['initialData']) => {
        abortController.abort();
        setData(externalData);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        const promise = getPromise({
            contract,
            endpoint,
            endpointParams,
            options: {signal}
        });

        promise
            .then(response => {
                setData(response);
                setError(null);
                debug(prepareUrl(endpoint, endpointParams), debugId, RESULT_TYPES.SUCCESS);
            })
            .catch(err => {
                logError(err);
                setError(err);
                debug(prepareUrl(endpoint, endpointParams), debugId, RESULT_TYPES.ERROR);
            })
            .finally(() => setIsLoading(false));

        return () => {
            abortController.abort();
        };
    }, [contract, debugId, endpoint, endpointParams, ...deps]);

    return [data, setExternalData, isLoading, error, abortController];
}

/**
 * Read multiple values of a list of Promises using <b>Promise.all</b> method.
 *
 * @param contract - Promise used to fetch data. If not present, the <b>fetch</b> API is used instead.
 * @param debugId - Instance identifier used to log a debug message. If not present, no message will be display.
 * @param deps - List of optional dependencies used to trigger a new fetch.
 * @param endpoint - Target remote address.
 * @param endpointsParams - Query parameters.
 * @param initialData - Initial state.
 */
function useAllData({
    contract,
    debugId,
    deps = [],
    endpoints,
    endpointsParams = [],
    initialData = {}
}: AllDataArgs) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const abortController = new AbortController();
    const {signal} = abortController;
    const setExternalData = (externalData: AllDataArgs['initialData']) => {
        abortController.abort();
        setData(externalData);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        const promises = bucketFetch(contract, endpoints, endpointsParams, {signal});

        Promise.all(promises)
            .then(responses => {
                const newData = mergeAllResponses(endpoints, responses);
                setData(newData);
                setError(null);
                debug(prepareUrls(endpoints, endpointsParams).join('\n'), debugId, RESULT_TYPES.SUCCESS);
            })
            .catch(err => {
                logError(err);
                setError(err);
                debug(prepareUrls(endpoints, endpointsParams).join('\n'), debugId, RESULT_TYPES.ERROR);
            })
            .finally(() => setIsLoading(false));

        return () => {
            abortController.abort();
        };
    }, [contract, debugId, endpoints.join(), endpointsParams, ...deps]);

    return [data, setExternalData, isLoading, error, abortController];
}

/**
 * Read multiple values of a list of Promises using <b>Promise.allSettled</b> method.
 *
 * @param contract - Promise used to fetch data. If not present, the <b>fetch</b> API is used instead.
 * @param debugId - Instance identifier used to log a debug message. If not present, no message will be display.
 * @param deps - List of optional dependencies used to trigger a new fetch.
 * @param endpoint - Target remote address.
 * @param endpointsParams - Query parameters.
 * @param initialData - Initial state.
 */
function useAllSettledData({
    contract,
    debugId,
    deps = [],
    endpoints,
    endpointsParams = [],
    initialData = {}
}: AllDataArgs) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const abortController = new AbortController();
    const {signal} = abortController;
    const setExternalData = (externalData: AllDataArgs['initialData']) => {
        abortController.abort();
        setData(externalData);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        const promises = bucketFetch(contract, endpoints, endpointsParams, {signal});

        Promise.allSettled(promises)
            .then(responses => {
                const newData = mergeAllSettledResponses(endpoints, responses);
                setData(newData);
                setError(null);

                if (responses?.some(response => response.status === 'rejected')) {
                    throw new CustomAbortedError();
                }
                debug(prepareUrls(endpoints, endpointsParams).join('\n'), debugId, RESULT_TYPES.SUCCESS);
            })
            .catch(err => {
                logError(err);
                setError(err);
                debug(prepareUrls(endpoints, endpointsParams).join('\n'), debugId, RESULT_TYPES.ERROR);
            })
            .finally(() => setIsLoading(false));

        return () => {
            abortController.abort();
        };
    }, [contract, debugId, endpoints.join(), endpointsParams, ...deps]);

    return [data, setExternalData, isLoading, error, abortController];
}

function debug(uri: string, debugId: string | undefined, type: string) {
    if (debugId) {
        if (type === RESULT_TYPES.ERROR) {
            console.info(`%cDEBUG MESSAGE:\nABORTED CALL: ${debugId}\n${uri}`, 'background: #FFCCCB');
        } else if (type === RESULT_TYPES.SUCCESS) {
            console.info(`%cDEBUG MESSAGE:\nSUCCESSFULLY FETCHED: ${debugId}\n${uri}`, 'background: #E0FFFF');
        }
    }
}

function logError(err: Error) {
    const message = ['AbortError', 'CustomAbortedError'].includes(err.name)
        ? 'Signal is aborted by the user'
        : err;
    console.error(message);
}

export {
    debug,
    logError,
    useData,
    useAllData,
    useAllSettledData
};
