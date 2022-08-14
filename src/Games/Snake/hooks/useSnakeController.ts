import { useEffect, useRef, useState } from 'react';
import { isOutsideGrid, Queue, randomValue } from 'utils/common';
import useInterval from 'hooks/useInterval';


type Directions = 'up' | 'right' | 'down' | 'left' | 'stop';

type Moves = {
    [key in Directions]: (v: number) => number;
};

type Settings = {
    width: number,
    height: number,
    tickDelay: number,
}

type FieldChange = {
    head: number,
    trail?: number,
    apple?: number,
}

const keyUp = ['ArrowUp', 'w', 'ц'],
    keyRight = ['ArrowRight', 'd', 'в'],
    keyDown = ['ArrowDown', 's', 'ы'],
    keyLeft = ['ArrowLeft', 'a', 'ф'];

const horizontal = ['left', 'right'],
    vertical = ['up', 'down'];

const useSnakeController = (settings: Settings) => {
    const snake = useRef(new Queue<number>());
    const apple = useRef(0);
    const cells = useRef<HTMLDivElement[]>([]);
    const direction = useRef<Directions>('stop');
    const keyLock = useRef(false);
    const [curScore, setCurScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [gameActive, setGameActive] = useState(true);

    const moves: Moves = {
        up: pos => pos - settings.width,
        right: pos => pos + 1,
        down: pos => pos + settings.width,
        left: pos => pos - 1,
        stop: pos => pos,
    };

    useEffect(() => {
        cells.current = Array.from(document.querySelectorAll<HTMLDivElement>('.field > div'));

        gameStart();

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useInterval(() => {
        if (keyLock.current)
            keyLock.current = false;

        if (direction.current === 'stop') return;

        const change = move();

        if (!change)
            gameOver();
        else
            updateField(change);
    }, settings.tickDelay);

    const updateField = (change: FieldChange) => {
        cells.current[change.head].className = 'snake';
        if (change.trail)
            cells.current[change.trail].className = '';
        if (change.apple)
            cells.current[change.apple].className = 'apple';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (keyLock.current)
            return;

        if (keyUp.includes(e.key)) {
            if (!vertical.includes(direction.current)) {
                setDirection('up');
            }
        } else if (keyDown.includes(e.key)) {
            if (!vertical.includes(direction.current)) {
                setDirection('down');
            }
        } else if (keyRight.includes(e.key)) {
            if (!horizontal.includes(direction.current)) {
                setDirection('right');
            }
        } else if (keyLeft.includes(e.key)) {
            if (!horizontal.includes(direction.current)) {
                setDirection('left');
            }
        }
    };

    const setDirection = (dir: Directions) => {
        direction.current = dir
        keyLock.current = true;
    };

    const move = (): FieldChange | null => {
        const head = snake.current.getTail()!;
        const next = moves[direction.current](head);

        if (isCollision(head, next))
            return null;

        snake.current.enqueue(next); // new head position

        if (next === apple.current) {
            setCurScore(old => old + 1);
            placeApple();
            return {
                head: next,
                apple: apple.current, // already new position
            };
        }

        return {
            head: next,
            trail: snake.current.dequeue(), // old tail position,
        };
    };

    const isCollision = (from: number, to: number) => {
        if (isOutsideGrid(settings.width, settings.height, from, to))
            return true;

        const body = snake.current.getValues();

        return body.includes(to); // body intersect
    };

    const placeApple = () => {
        const cells = Array.from(Array(settings.width * settings.height).keys());
        const body = new Set(snake.current.getValues());
        apple.current = randomValue(cells.filter(x => !body.has(x)));
    };

    const gameStart = () => {
        setCurScore(0);
        setGameActive(true);

        const total = settings.width * settings.height;
        apple.current = Math.floor(Math.random() * total);

        const head = Math.floor(Math.random() * total);
        snake.current = new Queue<number>();
        snake.current.enqueue(head);

        updateField({head, apple: apple.current});
    };

    const gameOver = () => {
        setDirection('stop');
        setMaxScore(old => curScore > old ? curScore : old);
        setGameActive(false);
        clearField();
    };

    const clearField = () => {
        const rows = Object.fromEntries(
            Array.from(Array(settings.height))
                .map((_, i) => [i, [] as HTMLDivElement[]])
        );

        cells.current.forEach((cell, i) => rows[Math.floor(i/settings.width)].push(cell));

        for (const delay in rows) {
            setTimeout(() => {
                rows[delay].forEach(cell => cell.className = 'snake')
            }, 40 * +delay);

            setTimeout(() => {
                rows[delay].forEach(cell => cell.className = '')
            }, 40 * +delay + 120);
        }
    };

    return {
        curScore,
        maxScore,
        gameActive,
        gameStart,
    };
};

export default useSnakeController;
