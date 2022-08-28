import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import useInterval from 'hooks/useInterval';
import useLocalStorage from 'hooks/useLocalStorage';
import { replaceItemAtIndex } from 'utils/common';
import { scoreAtom } from 'Games/CowTrain/atoms/score';
import { clickAtom } from 'Games/CowTrain/atoms/clickTrigger';
import { gang, MemberSettings } from 'Games/CowTrain/config';


export type Member = MemberSettings & {
    level: number,
    price: number,
    available: boolean,
    canPromote: boolean,
};

const startLevel: number[] = Array(gang.length).fill(0);
startLevel[0] = 1;

const useCowTrainController = () => {
    const [levels, setLevels] = useLocalStorage('cowTrain/levels', startLevel);
    const setScore = useSetRecoilState(scoreAtom);
    const setClicks = useSetRecoilState(clickAtom);
    // cache values
    const [increment, setIncrement] = useState(0);
    const [members, setMembers] = useState<Member[]>([]);

    // on load
    useEffect(() => setScore(+(localStorage.getItem('cowTrain/score') || 0)), []);

    // on load or member level change
    useEffect(() => {
        let increment = 0;
        for (let i = 1; i < levels.length; i++) {
            increment += gang[i].power * levels[i];
        }

        setIncrement(increment);
        tryUpdateMembers(true);
    }, [levels]);

    // four times at second
    useInterval(() => {
        const curTick = Date.now();

        // use storage directly to avoid re-renders of whole game
        const interval = curTick - +(localStorage.getItem('cowTrain/tick') || 0);
        localStorage.setItem('cowTrain/tick', JSON.stringify(curTick));

        if (increment > 0)
            setScore(score => Math.ceil(score + increment * interval / 1000));

        tryUpdateMembers();
    }, 500);

    const click = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // if clicked exactly train
        if ((e.target as HTMLDivElement).className === 'train') {
            setScore(score => score + gang[0].power * levels[0]);
            setClicks(old => old + 1);
        }
    }, [setScore, levels]);

    const tryUpdateMembers = useRecoilCallback(({ snapshot }) => (forced?: boolean) => {
        const score = snapshot.getLoadable(scoreAtom).contents;

        const gangHydrated: Member[] = gang.map(member => {
            const level = levels[member.idx];
            const price = Math.ceil(member.cost * Math.pow(1.15, level));
            const available = member.idx === 1 || level > 0 || price * .8 < score;

            return {
                ...member,
                level,
                price,
                available,
                canPromote: price <= score,
            }
        });

        setMembers(old => {
            if (forced) return gangHydrated;

            // update data only if changed
            for (const idx in old) {
                if (old[idx].canPromote !== gangHydrated[idx].canPromote
                    || old[idx].available !== gangHydrated[idx].available) {
                    return gangHydrated;
                }
            }

            return old;
        });
    }, [levels]);

    const promote = useCallback((idx: number) => {
        const price = Math.ceil(gang[idx].cost * Math.pow(1.15, levels[idx]))

        setScore(score => score - price);
        setLevels(old => replaceItemAtIndex(old, idx, old[idx] + 1));
    }, [setScore, setLevels, levels]);

    return {
        members,
        click,
        promote,
    };
};

export default useCowTrainController;
