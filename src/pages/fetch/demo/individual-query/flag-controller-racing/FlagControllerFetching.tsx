import React, {ChangeEvent, useState} from 'react';

import FlagControllerPeopleTable
    from '@/pages/fetch/demo/individual-query/flag-controller-racing/FlagControllerPeopleTable';
import FilterBar from '@/pages/fetch/demo/individual-query/FilterBar';
import {PEOPLE_URL} from '@/shared/globals';

export default function FlagControllerFetching() {
    const [endpointParams, setEndpointParams] = useState({});

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEndpointParams({
            name: e.target.value,
            delay: Math.random() * 1000
        });
    };

    return (
        <div className="flag-controller-racing">
            <h4>Flag Controller Fetching</h4>
            <FilterBar handleInputChange={handleInputChange} />
            <FlagControllerPeopleTable endpoint={PEOPLE_URL} endpointParams={endpointParams} />
        </div>
    );
}
