import React from 'react';
import {GenericObject} from '@/hooks/fetch/http.utils';
import {PeopleTableModel} from '@/shared/globals';
import {useFlaggedData} from '@/hooks/fetch/useFlaggedData';

export default function FlagControllerPeopleTable({uri}: PeopleTableModel) {
    const [data, setData, isLoading] = useFlaggedData({
        endpoint: uri,
        id: 'Flag Fetching',
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
