import {useEffect, useState} from 'react';
import {AllDataHookInput, DataHookInput, RESULT_TYPES} from '@/hooks/fetch/useData.types';
import {bucketFetch, mergeAllResponses, mergeAllSettledResponses} from '@/hooks/fetch/http.utils';
import {CustomAbortedError} from '@/hooks/fetch/errors';

function useData({
    endpoint,
    id,
    initialData = {},
    initialLoading = true
}: DataHookInput) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(initialLoading);

    const abortController = new AbortController();
    const signal = abortController.signal;
    const setExternalData = (externalData: any) => {
        abortController.abort();
        setData(externalData);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);

        fetch(endpoint, {signal})
            .then(response => response.json())
            .then(response => {
                setData(response);
                setError(null);
                debug(endpoint, id, RESULT_TYPES.SUCCESS);
            })
            .catch(err => {
                logError(err);
                setError(err);
                debug(endpoint, id, RESULT_TYPES.ERROR);
            })
            .finally(() => setIsLoading(false));

        return () => {
            abortController.abort();
        }
    }, [endpoint]);

    return [data, setExternalData, isLoading, error, abortController];
}

function useAllData({
    endpoints,
    id,
    initialData = {},
    initialLoading = true
}: AllDataHookInput) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(initialLoading);

    const abortController = new AbortController();
    const signal = abortController.signal;
    const setExternalData = (externalData: any) => {
        abortController.abort();
        setData(externalData);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        const promises = bucketFetch(endpoints, {signal});

        Promise.all(promises)
            .then(responses => {
                const newData = mergeAllResponses(endpoints, responses);
                setData(newData);
                setError(null);
                debug(endpoints.join('\n'), id, RESULT_TYPES.SUCCESS);
            })
            .catch(err => {
                logError(err);
                setError(err);
                debug(endpoints.join('\n'), id, RESULT_TYPES.ERROR);
            })
            .finally(() => setIsLoading(false));

        return () => {
            abortController.abort();
        }
    }, [endpoints]);

    return [data, setExternalData, isLoading, error, abortController];
}

function useAllSettledData({
    endpoints,
    id,
    initialData = {},
    initialLoading = true
}: AllDataHookInput) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(initialLoading);

    const abortController = new AbortController();
    const signal = abortController.signal;
    const setExternalData = (externalData: any) => {
        abortController.abort();
        setData(externalData);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        const promises = bucketFetch(endpoints, {signal});

        Promise.allSettled(promises)
            .then(responses => {
                const newData = mergeAllSettledResponses(endpoints, responses);
                setData(newData);
                setError(null);

                if (responses.some(response => response.status === 'rejected')) {
                    throw new CustomAbortedError();
                }
                debug(endpoints.join('\n'), id, RESULT_TYPES.SUCCESS);
            })
            .catch(err => {
                logError(err);
                setError(err);
                debug(endpoints.join('\n'), id, RESULT_TYPES.ERROR);
            })
            .finally(() => setIsLoading(false));

        return () => {
            abortController.abort();
        }
    }, [endpoints]);

    return [data, setExternalData, isLoading, error, abortController];
}

function debug(endpoint: string, id: string | undefined, type: string) {
    if (id) {
        if (type === RESULT_TYPES.ERROR) {
            console.info(`%cDEBUG MESSAGE:\nABORTED CALL: ${id}\n${endpoint}`, 'background: #FFCCCB');
        } else if (type === RESULT_TYPES.SUCCESS) {
            console.info(`%cDEBUG MESSAGE:\nSUCCESSFULLY FETCHED: ${id}\n${endpoint}`, 'background: #E0FFFF');
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
