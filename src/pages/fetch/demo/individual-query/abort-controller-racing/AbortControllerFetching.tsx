import React, {ChangeEvent, useState} from 'react';
import AbortControllerPeopleTable from '@/pages/fetch/demo/individual-query/abort-controller-racing/AbortControllerPeopleTable';
import FilterBar from '@/pages/fetch/demo/individual-query/FilterBar';
import {prepareUrl} from '@/hooks/fetch/http.utils';
import {PEOPLE_URL} from '@/shared/globals';

export default function AbortControllerFetching() {
    const [uri, setUri] = useState(PEOPLE_URL);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newUri = prepareUrl(PEOPLE_URL, {
            name: e.target.value,
            delay: Math.random() * 1000
        });
        setUri(newUri);
    };

    return (
        <div className="abort-controller-racing">
            <h4>Abort Controller Fetching</h4>
            <FilterBar handleInputChange={handleInputChange} />
            <AbortControllerPeopleTable uri={uri} />
        </div>
    );
}
