import {useEffect, useState} from 'react';

import {DataArgs, RESULT_TYPES} from '@/hooks/fetch/useData.types';
import {getPromise, prepareUrl} from '@/hooks/fetch/http.utils';
import {debug, logError} from '@/hooks/fetch/useData';

function useFlaggedData({
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

export {
    useFlaggedData
};
