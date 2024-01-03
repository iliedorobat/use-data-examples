import React, {useEffect, useState} from 'react';

import {debug} from '@/hooks/fetch/useData';
import {GenericObject} from '@/hooks/fetch/http.types';
import {PeopleTableProps} from '@/shared/tables.types';
import {Person} from '@/pages/api/people';
import {prepareUrl} from '@/hooks/fetch/http.utils';
import {RESULT_TYPES} from '@/hooks/fetch/useData.types';

export default function OrdinaryPeopleTable({endpoint, endpointParams}: PeopleTableProps) {
    const [people, setPeople] = useState({} as Person);
    const data = people.results || [];

    useEffect(() => {
        const url = prepareUrl(endpoint, endpointParams);
        debug(url, 'Ordinary Fetching', RESULT_TYPES.SUCCESS);

        setTimeout(() => {
            fetch(url)
                .then(resp => resp.json())
                .then(resp => {
                    setPeople(resp);
                });
        }, Math.random() * 1000);
    }, [endpoint, endpointParams]);

    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                <tr>
                    <th>Position</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Height</th>
                </tr>
                </thead>
                <tbody>
                    {data.map((item: GenericObject, index: number) => (
                        <tr key={item.name}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.gender}</td>
                            <td>{item.height}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
