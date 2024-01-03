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

function useData({
    contract,
    debugId,
    deps = [],
    endpoint,
    endpointParams,
    initialData = {},
    initialLoading = true
}: DataArgs) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(initialLoading);

    const abortController = new AbortController();
    const signal = abortController.signal;
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
        }
    }, [endpoint, endpointParams, ...deps]);

    return [data, setExternalData, isLoading, error, abortController];
}

function useAllData({
    contract,
    debugId,
    deps = [],
    endpoints,
    endpointsParams = [],
    initialData = {},
    initialLoading = true
}: AllDataArgs) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(initialLoading);

    const abortController = new AbortController();
    const signal = abortController.signal;
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
        }
    }, [endpoints, endpointsParams, ...deps]);

    return [data, setExternalData, isLoading, error, abortController];
}

function useAllSettledData({
    contract,
    debugId,
    deps = [],
    endpoints,
    endpointsParams = [],
    initialData = {},
    initialLoading = true
}: AllDataArgs) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(initialLoading);

    const abortController = new AbortController();
    const signal = abortController.signal;
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

                if (responses.some(response => response.status === 'rejected')) {
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
        }
    }, [endpoints, endpointsParams, ...deps]);

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
}
