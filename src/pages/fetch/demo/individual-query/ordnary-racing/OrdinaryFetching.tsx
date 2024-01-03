import React, {ChangeEvent, useState} from 'react';

import FilterBar from '@/pages/fetch/demo/individual-query/FilterBar';
import OrdinaryPeopleTable from '@/pages/fetch/demo/individual-query/ordnary-racing/OrdinaryPeopleTable';
import {PEOPLE_URL} from '@/shared/globals';

export default function OrdinaryFetching() {
    const [endpointParams, setEndpointParams] = useState({});

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEndpointParams({
            name: e.target.value,
            delay: Math.random() * 1000
        });
    };

    return (
        <div className="ordinary-racing">
            <h4>Ordinary Fetching</h4>
            <FilterBar handleInputChange={handleInputChange} />
            <OrdinaryPeopleTable endpoint={PEOPLE_URL} endpointParams={endpointParams} />
        </div>
    );
}
