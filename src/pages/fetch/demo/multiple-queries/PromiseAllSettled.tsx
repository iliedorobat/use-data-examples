import React, {useState} from 'react';

import MultipleQueriesForm from '@/pages/fetch/demo/multiple-queries/MultipleQueriesForm';
import {useAllSettledData} from '@/hooks/fetch/useData';

export default function PromiseAllSettled() {
    const [endpoints, setEndpoints] = useState([] as Array<string>);
    const [endpointsParams, setEndpointsParams] = useState([] as Array<object>);
    const [data, setData, isLoading] = useAllSettledData({
        endpoints,
        endpointsParams,
        debugId: 'Aborted All Settled Data Fetching'
    });

    return (
        <div className="promise-all-settled">
            <h4>Promise All Settled</h4>
            <MultipleQueriesForm setEndpoints={setEndpoints} setEndpointsParams={setEndpointsParams} />
        </div>
    );
}
