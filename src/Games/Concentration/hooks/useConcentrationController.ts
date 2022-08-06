import { useCallback, useEffect, useRef, useState } from 'react';
import { replaceItemAtIndex, shuffle } from 'utils/common';
import useDidUpdateEffect from "hooks/useDidUpdateEffect";
import useInterval from "hooks/useInterval";


export type CardModel = {
    value: string,
    flipped: boolean,
}

const settings = {
    pairCount: 16, // max 30, for emojis count
    rows: 4,
    flipTime: 500,
};

const emojis = [
    '😃', '💣', '💯', '❤', '🖖',
    '🤟', '🧚', '💃', '🐶', '🐪',
    '🐙', '🌵', '🍕', '🌏', '🏯',
    '♨', '🛵', '⏰', '🌛', '🌈',
    '🔥', '🎏', '🎳', '🎲', '🎵',
    '🥁', '💾', '📺', '💰', '📫',
];

const useTicTacToeController = () => {
    const lock = useRef(true);
    const [ gameActive, setGameActive ] = useState(false);
    const [ cards, setCards ] = useState<CardModel[]>([]);
    const [ prevFlipped, setPrevFlipped ] = useState(-1);
    const [ curFlipped, setCurFlipped ] = useState(-1);
    const [ moves, setMoves ] = useState(0);
    const [ score, setScore ] = useState(0);
    const [ timer, setTimer ] = useState(0);

    useEffect(() => {
        setCards(Array.from(Array(settings.pairCount * 2)).map(() => ({
            value: '',
            flipped: false,
        })));
    }, []);

    useDidUpdateEffect(() => {
        const id = setTimeout(() => checkState(prevFlipped, curFlipped), settings.flipTime);
        return () => clearTimeout(id);
    }, [curFlipped]);

    useInterval(() => {
        gameActive ? setTimer(old => old + 1) : flipRandom();
    }, 1000);

    const flipRandom = () => {
        const idx = Math.floor(Math.random() * cards.length);
        setCards(old => replaceItemAtIndex(old, idx, {...old[idx], flipped: !old[idx].flipped}));
    };

    const checkState = (prev: number, cur: number) => {
        if (prev < 0) {
            setPrevFlipped(cur);
            return;
        }

        if (cards[prev].value !== cards[cur].value) { // if it is not pair - flip back
            setCards(old => {
                const temp = [...old];

                temp[cur].flipped = false;
                temp[prev].flipped = false;

                return temp;
            });
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

        setCards(old => replaceItemAtIndex(old, idx, {...old[idx], flipped: true}));
        setMoves(old => old + 1);
        setCurFlipped(idx);

        lock.current = true;
        setTimeout(() => lock.current = false, settings.flipTime);
    }, []);

    const gameStart = () => {
        const images = shuffle(emojis);
        const deck = Array.from(Array(settings.pairCount)).map(() => ({
            value: images.pop()!,
            flipped: false,
        }));

        setCards(shuffle([...deck, ...deck.map(c => ({...c}))]));
        setMoves(0);
        setScore(0);
        setTimer(0);
        setPrevFlipped(-1);
        setCurFlipped(-1);
        setGameActive(true);
        lock.current = false;
    };

    return {
        moves,
        score,
        timer,
        gameActive,
        cards,
        flip,
        gameStart,
        cardsInRow: Math.floor(settings.pairCount / settings.rows * 2),
    };
};

export default useTicTacToeController;
