import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useInterval from 'hooks/useInterval';
import { clickAtom } from 'Games/CowTrain/atoms/clickTrigger';


type MoneyProps = {
    count: number,
}

type Money = {
    x: number,
    y: number,
    ttl: number,
    id: number,
}

const banknote = '💴';

const animationTime = 1950;

const generateBanknote = (ttl: number) => ({
    id: Math.random(),
    x: Math.floor(Math.random() * 80) + 10, // 10 to 90% of width
    y: Math.floor(Math.random() * 50) + 20, // 20 to 70% of height
    ttl,
});

const Money = ({ count }: MoneyProps) => {
    const clicks = useRecoilValue(clickAtom);
    const [money, setMoney] = useState<Money[]>([]);

    useEffect(() => {
        if (clicks < 1) return;

        setMoney(old => [
            ...old,
            generateBanknote(Date.now() + animationTime),
        ]);
    }, [clicks]);

    // generate banknotes for auto-clicks
    useInterval(() => {
        const now = Date.now();
        const newMoney: Money[] = [];

        if (count > 0) {
            const future = now + animationTime;

            for (let i = 0; i < count; i++) {
                newMoney.push(generateBanknote(future));
            }
        }

        setMoney(old => {
            return [
                ...old.filter(t => t.ttl >= now),
                ...newMoney,
            ];
        });
    }, 500);

    return (
        <div>
            {money.map(m => (
                <span
                    key={m.id}
                    className="banknote"
                    style={{
                        top: `${m.y}%`,
                        left: `${m.x}%`,
                    }}
                >
                    {banknote}
                </span>
            ))}
        </div>
    );
};

export default Money;
