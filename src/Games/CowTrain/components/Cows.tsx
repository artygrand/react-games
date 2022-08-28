import React, { ReactNode, useState } from 'react';
import { randomValue } from 'utils/common';
import useInterval from 'hooks/useInterval';


type CowsProps = {
    maxLength: number,
}

type Corovan = {
    cow: ReactNode,
    ttl: number,
    height: number,
}

const cows = ['🐂', '🐃', '🐄'];

const wagons = ['🚌', '🚟', '🚎', '🚋', '🚃', '🛒', '🛁'];

const generateCorovan = (maxLength: number): [ReactNode, number] => {
    const len = Math.floor(Math.random() * maxLength - 1) + 1;
    let cow = <span className="cow">{randomValue(cows)}</span>;
    let train = [];

    for (let i = 0; i < len; i++) {
        train.push(<span key={i} className="wagon">{randomValue(wagons)}</span>);
    }

    return [<>{cow}{train}</>, len + 1];
};

const Cows = ({ maxLength }: CowsProps ) => {
    const [trains, setTrains] = useState<Corovan[]>([{
        cow: generateCorovan(1)[0],
        ttl: 6400 + Date.now(),
        height: Math.floor(Math.random() * 50) + 20,
    }]);

    // generate corovan
    useInterval(() => {
        setTrains(old => {
            const [train, len] = generateCorovan(maxLength);
            const now = Date.now();

            return [
                ...old.filter(t => t.ttl >= now),
                {
                    cow: train,
                    ttl: 5000 + len * 700 + now,
                    height: Math.floor(Math.random() * 50) + 20,
                }
            ];
        });
    }, 5000 - maxLength * 350);

    return (
        <div>
            {trains.map(train => (
                <span
                    key={train.ttl}
                    className="train"
                    style={{
                        top: `${train.height}%`,
                        zIndex: train.height,
                    }}
                >
                    {train.cow}
                </span>
            ))}
        </div>
    );
};

export default Cows;
