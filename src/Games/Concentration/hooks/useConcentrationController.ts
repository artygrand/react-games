import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import useDidUpdateEffect from 'hooks/useDidUpdateEffect';
import useInterval from 'hooks/useInterval';
import { movesAtom } from 'Games/Concentration/atoms/moves';
import { timerAtom } from 'Games/Concentration/atoms/timer';
import { scoreAtom } from 'Games/Concentration/atoms/score';
import { range, replaceItemAtIndex, shuffle, sleep } from 'utils/common';


export type CardModel = {
    idx: number,
    value: string,
    flipped: boolean,
}

export type CardGameSettings = {
    pairCount: number,
    cols: number,
    flipTime: number,
}

const emojis = [
    '😃', '💣', '💯', '❤', '🖖',
    '🤟', '🧚', '💃', '🐶', '🐪',
    '🐙', '🌵', '🍕', '🌏', '🏯',
    '♨', '🛵', '⏰', '🌛', '🌈',
    '🔥', '🎏', '🎳', '🎲', '🎵',
    '🥁', '💾', '📺', '💰', '📫',
];

const useConcentrationController = (settings: CardGameSettings) => {
    const lock = useRef(true);
    const [ gameActive, setGameActive ] = useState(false);
    const [ cards, setCards ] = useState<CardModel[]>([]);
    const [ prevFlipped, setPrevFlipped ] = useState(-1);
    const [ curFlipped, setCurFlipped ] = useState(-1);
    const [ score, setScore ] = useRecoilState(scoreAtom);
    const setMoves = useSetRecoilState(movesAtom);
    const setTimer = useSetRecoilState(timerAtom);

    // on load
    useEffect(() => {
        fillWithEmptyCards();
    }, []);

    // on every flip
    useDidUpdateEffect(() => {
        if (prevFlipped < 0) {
            setPrevFlipped(curFlipped);
            return;
        }

        const id = setTimeout(() => checkState(prevFlipped, curFlipped), settings.flipTime);
        return () => clearTimeout(id);
    }, [curFlipped]);

    useInterval(() => {
        gameActive ? setTimer(old => old + 1) : flipRandom();
    }, 1000);

    const fillWithEmptyCards = useCallback(() => {
        setCards(range(settings.pairCount * 2).map(i => ({
            idx: i,
            value: '',
            flipped: false,
        })));
    }, [setCards]);

    const flipRandom = () => {
        const idx = Math.floor(Math.random() * cards.length);
        setCards(old => replaceItemAtIndex(old, idx, {...old[idx], flipped: !old[idx].flipped}));
    };

    const lockWhileFlip = () => {
        lock.current = true;
        setTimeout(() => lock.current = false, settings.flipTime);
    };

    const checkState = (prev: number, cur: number) => {
        if (cards[prev].value !== cards[cur].value) { // if it's not a pair
            // flip back
            setCards(old => {
                const temp = [...old];

                temp[cur].flipped = false;
                temp[prev].flipped = false;

                return temp;
            });
            lockWhileFlip();
        } else {
            if (score === settings.pairCount - 1)
                setGameActive(false);

            setScore(old => old + 1);
        }

        setPrevFlipped(-1);
    };

    const flip = useCallback((idx: number) => {
        if (lock.current)
            return;

        lockWhileFlip();

        setCards(old => replaceItemAtIndex(old, idx, {...old[idx], flipped: true}));
        setMoves(old => old + 1);
        setCurFlipped(idx);
    }, []);

    const gameStart = () => {
        fillWithEmptyCards();

        sleep(settings.flipTime).then(() => {
            const images = shuffle(emojis);
            const deck = range(settings.pairCount).map(() => images.pop()!);
            const doubled = shuffle([...deck, ...deck]);

            setCards(doubled.map((value, i) => ({
                idx: i,
                value: value,
                flipped: false,
            })));

            setMoves(0);
            setScore(0);
            setTimer(0);
            setPrevFlipped(-1);
            setCurFlipped(-1);
            setGameActive(true);
            lock.current = false;
        });
    };

    return {
        gameActive,
        cards,
        flip,
        gameStart,
    };
};

export default useConcentrationController;
