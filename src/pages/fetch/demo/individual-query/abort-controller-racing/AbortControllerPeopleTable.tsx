import React from 'react';

import {ContractArgs} from '@/hooks/fetch/http.types';
import {GenericObject} from '@/hooks/fetch/http.types';
import {PeopleTableProps} from '@/shared/tables.types';
import {prepareUrl} from '@/hooks/fetch/http.utils';
import {useData} from '@/hooks/fetch/useData';

const contract = ({endpoint, endpointParams, options}: ContractArgs) => {
    if (endpoint) {
        const url = prepareUrl(endpoint, endpointParams);
        return fetch(url, options).then(response => response.json());
    }

    return new Promise((resolve, reject) => {
        reject('The contract/endpoint in not valid!');
    });
};

export default function AbortControllerPeopleTable({endpoint, endpointParams}: PeopleTableProps) {
    const [data, setData, isLoading] = useData({
        contract,
        endpoint,
        endpointParams,
        debugId: 'Aborted Fetching',
        initialData: {
            count: 0,
            results: []
        }
    });

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
                    {data.results.map((item: GenericObject, index: number) => (
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
