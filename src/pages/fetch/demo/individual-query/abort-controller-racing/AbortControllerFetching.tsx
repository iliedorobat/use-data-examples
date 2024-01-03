import React, {ChangeEvent, useState} from 'react';

import AbortControllerPeopleTable
    from '@/pages/fetch/demo/individual-query/abort-controller-racing/AbortControllerPeopleTable';
import FilterBar from '@/pages/fetch/demo/individual-query/FilterBar';
import {PEOPLE_URL} from '@/shared/globals';

export default function AbortControllerFetching() {
    const [endpointParams, setEndpointParams] = useState({});

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEndpointParams({
            name: e.target.value,
            delay: Math.random() * 1000
        });
    };

    return (
        <div className="abort-controller-racing">
            <h4>Abort Controller Fetching</h4>
            <FilterBar handleInputChange={handleInputChange} />
            <AbortControllerPeopleTable endpoint={PEOPLE_URL} endpointParams={endpointParams} />
        </div>
    );
}
