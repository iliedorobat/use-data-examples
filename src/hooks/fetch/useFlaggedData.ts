import {useEffect, useState} from 'react';

import {DataArgs, RESULT_TYPES} from '@/hooks/fetch/useData.types';
import {getPromise, prepareUrl} from '@/hooks/fetch/http.utils';
import {logError} from '@/hooks/fetch/useData';

function useFlaggedData({
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

    let active = true;
    const setExternalData = (externalData: DataArgs['initialData']) => {
        active = false;
        setData(externalData);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        const promise = getPromise({
            contract,
            endpoint,
            endpointParams
        });

        promise
            .then(response => response.json())
            .then(response => {
                if (active) {
                    debug(prepareUrl(endpoint, endpointParams), debugId, RESULT_TYPES.SUCCESS);
                    setData(response);
                    setError(null);
                } else {
                    debug(prepareUrl(endpoint, endpointParams), debugId, RESULT_TYPES.ERROR);
                }
            })
            .catch(err => {
                logError(err);
                setError(err);
                debug(prepareUrl(endpoint, endpointParams), debugId, RESULT_TYPES.ERROR);
            })
            .finally(() => setIsLoading(false));

        return () => {
            active = false;
        }
    }, [endpoint, endpointParams, ...deps]);

    return [data, setExternalData, isLoading, error];
}

function debug(uri: string, debugId: string | undefined, type: string) {
    if (debugId) {
        if (type === RESULT_TYPES.ERROR) {
            console.info(`%cDEBUG MESSAGE:\nIGNORED CALL: ${debugId}\n${uri}`, 'background: #FED8B1');
        } else if (type === RESULT_TYPES.SUCCESS) {
            console.info(`%cDEBUG MESSAGE:\nSUCCESSFULLY FETCHED: ${debugId}\n${uri}`, 'background: #E0FFFF');
        }
    }
}

export {
    useFlaggedData
};
