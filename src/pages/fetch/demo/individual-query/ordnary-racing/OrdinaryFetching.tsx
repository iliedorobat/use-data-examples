import React, {ChangeEvent, useState} from 'react';
import FilterBar from '@/pages/fetch/demo/individual-query/FilterBar';
import OrdinaryPeopleTable from '@/pages/fetch/demo/individual-query/ordnary-racing/OrdinaryPeopleTable';
import {prepareUrl} from '@/hooks/fetch/http.utils';
import {PEOPLE_URL} from '@/shared/globals';

export default function OrdinaryFetching() {
    const [uri, setUri] = useState(PEOPLE_URL);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newUri = prepareUrl(PEOPLE_URL, {
            name: e.target.value,
            delay: Math.random() * 1000
        });
        setUri(newUri);
    };

    return (
        <div className="ordinary-racing">
            <h4>Ordinary Fetching</h4>
            <FilterBar handleInputChange={handleInputChange} />
            <OrdinaryPeopleTable uri={uri} />
        </div>
    );
}
