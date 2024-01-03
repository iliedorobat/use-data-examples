import React, {useState} from 'react';

import MultipleQueriesForm from '@/pages/fetch/demo/multiple-queries/MultipleQueriesForm';
import {useAllData} from '@/hooks/fetch/useData';

export default function PromiseAll() {
    const [endpoints, setEndpoints] = useState([] as Array<string>);
    const [endpointsParams, setEndpointsParams] = useState([] as Array<object>);
    const [data, setData, isLoading] = useAllData({
        endpoints,
        endpointsParams,
        debugId: 'Aborted All Data Fetching'
    });

    return (
        <div className="promise-all">
            <h4>Promise All</h4>
            <MultipleQueriesForm setEndpoints={setEndpoints} setEndpointsParams={setEndpointsParams} />
        </div>
    );
}
