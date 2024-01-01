import React, {useEffect, useState} from 'react';
import {debug} from '@/hooks/fetch/useData';
import {GenericObject} from '@/hooks/fetch/http.utils';
import {PeopleTableModel} from '@/shared/globals';
import {Person} from '@/pages/api/people';
import {RESULT_TYPES} from '@/hooks/fetch/useData.types';

export default function OrdinaryPeopleTable({uri}: PeopleTableModel) {
    const [people, setPeople] = useState({} as Person);
    const data = people.results || [];

    useEffect(() => {
        debug(uri, 'Ordinary Fetching', RESULT_TYPES.SUCCESS);

        setTimeout(() => {
            fetch(uri)
                .then(resp => resp.json())
                .then(resp => {
                    setPeople(resp);
                });
        }, Math.random() * 1000);
    }, [uri]);

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
