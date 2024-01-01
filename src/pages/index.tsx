import React, {useState} from 'react';
import AbortControllerFetching from '@/pages/fetch/demo/individual-query/abort-controller-racing/AbortControllerFetching';
import FlagControllerFetching from '@/pages/fetch/demo/individual-query/flag-controller-racing/FlagControllerFetching';
import OrdinaryFetching from '@/pages/fetch/demo/individual-query/ordnary-racing/OrdinaryFetching';
import PromiseAll from '@/pages/fetch/demo/multiple-queries/PromiseAll';
import PromiseAllSettled from '@/pages/fetch/demo/multiple-queries/PromiseAllSettled';

type ModeType = {
    LABEL: string,
    NAME: string,
    ORDER: number,
};

type ModesType = {
    [key: string]: ModeType
};

const MODES = {
    ABORT_CONTROLLER_FETCHING: {
        LABEL: 'Abort Controller Fetching',
        NAME: 'abortControllerFetching',
        ORDER: 2,
    },
    FLAG_CONTROLLER_FETCHING: {
        LABEL: 'Flag Controller Fetching',
        NAME: 'flagControllerFetching',
        ORDER: 1,
    },
    ORDINARY_FETCHING: {
        LABEL: 'Ordinary Fetching',
        NAME: 'ordinaryFetching',
        ORDER: 0
    },
    PROMISE_ALL: {
        LABEL: 'Promise All',
        NAME: 'promiseAll',
        ORDER: 3
    },
    PROMISE_ALL_SETTLED: {
        LABEL: 'Promise all Settled',
        NAME: 'promiseAllSettled',
        ORDER: 4
    },
} as ModesType;

export default function RacingExamples() {
    const [activeMode, setActiveMode] = useState(null as null | string);
    const [selectedMode, setSelectedMode] = useState(MODES.ORDINARY_FETCHING.NAME);

    return (
        <main className="demo">
            <div className="sidebar">
                {Object.keys(MODES).sort(sortBy).map(key => {
                    const mode = MODES[key];
                    const classNames = prepareClasses({activeMode, selectedMode, mode});

                    return (
                        <div
                            key={mode.NAME}
                            className={classNames.join(' ')}
                            onMouseOver={() => setActiveMode(mode.NAME)}
                            onMouseOut={() => setActiveMode(null)}
                            onClick={() => setSelectedMode(mode.NAME)}
                        >
                            <div className="card-body">
                                {mode.LABEL}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="content">
                {selectedMode === MODES.ABORT_CONTROLLER_FETCHING.NAME && <AbortControllerFetching />}
                {selectedMode === MODES.FLAG_CONTROLLER_FETCHING.NAME && <FlagControllerFetching />}
                {selectedMode === MODES.ORDINARY_FETCHING.NAME && <OrdinaryFetching />}
                {selectedMode === MODES.PROMISE_ALL.NAME && <PromiseAll />}
                {selectedMode === MODES.PROMISE_ALL_SETTLED.NAME && <PromiseAllSettled />}
            </div>
        </main>
    );
}

function prepareClasses({activeMode, selectedMode, mode}: {activeMode: string | null, selectedMode: string, mode: ModeType}) {
    const classNames = ['card', 'clickable', 'border-secondary'];

    if (selectedMode === mode.NAME) {
        classNames.push('bg-secondary');
        classNames.push('text-white');
    }

    if (activeMode === mode.NAME) {
        const index = classNames.indexOf('text-white');
        if (index > -1) {
            classNames.splice(index, 1, 'text-dark');
        }
        classNames.push('bg-light');
    }

    return classNames;
}

function sortBy(a: string, b: string) {
    if (MODES[a].ORDER < MODES[b].ORDER) {
        return -1;
    } else if (MODES[a].ORDER > MODES[b].ORDER) {
        return 1;
    }
    return 0;
}
