import {useEffect, useState} from 'react';
import {DataHookInput, RESULT_TYPES} from '@/hooks/fetch/useData.types';
import {logError} from '@/hooks/fetch/useData';

function useFlaggedData({
    endpoint = '',
    id,
    initialData = {},
    initialLoading = true
}: DataHookInput) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(initialLoading);

    let active = true;
    const setExternalData = (externalData: any) => {
        active = false;
        setData(externalData);
        setError(null);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);

        fetch(endpoint)
            .then(response => response.json())
            .then(response => {
                if (active) {
                    debug(endpoint, id, RESULT_TYPES.SUCCESS);
                    setData(response);
                    setError(null);
                } else {
                    debug(endpoint, id, RESULT_TYPES.ERROR);
                }
            })
            .catch(err => {
                logError(err);
                setError(err);
                debug(endpoint, id, RESULT_TYPES.ERROR);
            })
            .finally(() => setIsLoading(false));

        return () => {
            active = false;
        }
    }, [endpoint]);

    return [data, setExternalData, isLoading, error];
}

function debug(endpoint: string, id: string | undefined, type: string) {
    if (id) {
        if (type === RESULT_TYPES.ERROR) {
            console.info(`%cDEBUG MESSAGE:\nIGNORED CALL: ${id}\n${endpoint}`, 'background: #FED8B1');
        } else if (type === RESULT_TYPES.SUCCESS) {
            console.info(`%cDEBUG MESSAGE:\nSUCCESSFULLY FETCHED: ${id}\n${endpoint}`, 'background: #E0FFFF');
        }
    }
}

export {
    useFlaggedData
};
