import React from 'react';
import {ObjectType} from '@/hooks/fetch/http.types';
import {PeopleTableModel} from '@/shared/globals';
import {useFlaggedData} from '@/hooks/fetch/useFlaggedData';

export default function FlagControllerPeopleTable({endpoint}: PeopleTableModel) {
    const [data, setData, isLoading] = useFlaggedData({
        endpoint,
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
                    {data.results.map((item: ObjectType, index: number) => (
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
