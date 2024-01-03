import React, {ChangeEvent, useState} from 'react';
import FlagControllerPeopleTable from '@/pages/fetch/demo/individual-query/flag-controller-racing/FlagControllerPeopleTable';
import FilterBar from '@/pages/fetch/demo/individual-query/FilterBar';
import {prepareUrl} from '@/hooks/fetch/http.utils';
import {PEOPLE_URL} from '@/shared/globals';

export default function FlagControllerFetching() {
    const [endpoint, setEndpoint] = useState(PEOPLE_URL);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newUri = prepareUrl(PEOPLE_URL, {
            name: e.target.value,
            delay: Math.random() * 1000
        });
        setEndpoint(newUri);
    };

    return (
        <div className="flag-controller-racing">
            <h4>Flag Controller Fetching</h4>
            <FilterBar handleInputChange={handleInputChange} />
            <FlagControllerPeopleTable endpoint={endpoint} />
        </div>
    );
}
