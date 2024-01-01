import type { NextApiRequest, NextApiResponse } from 'next'
import people from './people.json';

export type Person = {
    [key: string]: any;
};

export type People = {
    count: number,
    results: Array<Person>
};

const META_KEYS = ['delay'];

// Mocked data taken from https://swapi.dev/api/people/
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<People>
) {
    const filteredData = filterPeople({
        count: people.length,
        results: people
    }, req.query);
    const delay = Number(req.query.delay || 0);

    if (delay > 0) {
        res.setTimeout(delay, () => {
            res.status(200).json(filteredData as People);
        });
    } else {
        res.status(200).json(filteredData as People);
    }
}

function filterPeople(data: People, query: Partial<{ [key: string]: string | string[]; }>) {
    const keys = Object.keys(query)
        .filter(key => !META_KEYS.includes(key));

    if (keys.length === 0) {
        return data;
    }

    const results = data.results.filter((person: Person) => {
        for (let key of Object.keys(query)) {
            const queryValue = query[key] || '';

            if (typeof person[key] === 'string' && typeof queryValue === 'string') {
                const itemValue = person[key] || '';

                if (itemValue.toLowerCase().includes(queryValue.toLowerCase())) {
                    return true;
                }
            }
        }

        return false;
    });

    return {
        count: data.count,
        results
    };
}
