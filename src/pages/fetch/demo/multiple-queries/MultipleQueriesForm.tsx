import React, {ChangeEvent, useState} from 'react';
import {ObjectType} from '@/hooks/fetch/http.types';
import {prepareUrl} from '@/hooks/fetch/http.utils';
import {PEOPLE_URL} from '@/shared/globals';

const getEndpoints = (start: number, end: number) => {
    const endpoints = [];

    for (let i = start; i < end; i++) {
        const url = prepareUrl(PEOPLE_URL, {
            url: `https://swapi.dev/api/people/${i}/`,
            delay: Math.random() * 1000
        });
        endpoints.push(url);
    }

    return endpoints;
};

export default function MultipleQueriesForm({setEndpoints}: ObjectType) {
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const updateEndpoints = () => {
        const urls = getEndpoints(min, max);
        setEndpoints(urls);
    };

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setMin(value);
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setMax(value);
    };

    return (
        <>
            <div className="form-group row">
                <label htmlFor="min" className="col-form-label col-sm-2">
                    Min:
                </label>
                <div className="col-sm-10">
                    <input
                        id="min"
                        type="number"
                        className="form-control"
                        placeholder="Min value"
                        defaultValue={min}
                        onChange={handleMinChange}
                    />
                </div>
            </div>
            <div className="form-group row">
                <label htmlFor="min" className="col-form-label col-sm-2">
                    Max:
                </label>
                <div className="col-sm-10">
                    <input
                        id="max"
                        type="number"
                        className="form-control"
                        defaultValue={max}
                        placeholder="Max value"
                        onChange={handleMaxChange}
                    />
                </div>
            </div>
            <button type="button" className="btn btn-success btn-sm" onClick={updateEndpoints}>
                Update endpoints list
            </button>
        </>
    );
}
