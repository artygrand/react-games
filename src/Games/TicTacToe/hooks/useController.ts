import { useEffect, useState } from 'react';
import { randomValue, replaceItemAtIndex } from 'utils/common';


export enum CellState {
    Empty,
    Cross,
    Circle,
}

enum Player {
    Human,
    Robot,
}

enum End {
    Win = -2,
    Tie = -1,
}

const defaultValues = Array(9).fill(CellState.Empty);
const defaultEmpties = Array.from(Array(9).keys());
const checks = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // diagonal
    [0, 4, 8],
    [2, 4, 6],
];

const useController = () => {
    const [ state, setState ] = useState([...defaultValues]);
    const [ emptyCells, setEmptyCells ] = useState([...defaultEmpties]);
    const [ turn, setTurn ] = useState(Player.Human);
    const [ score, setScore ] = useState({user: 0, tie: 0, bot: 0});
    const [ winner, setWinner ] = useState<string|null>(null);
    const [ gameOver, setGameOver ] = useState(false);

    useEffect(() => {
        // on first run
        if (emptyCells.length === 9)
            return;

        // someone won or bot can choose any empty cell
        const result = check(turn === Player.Robot ? CellState.Cross : CellState.Circle);

        // looks like no variants for bot
        if (result < 0) {
            setGameOver(true);

            if (result === End.Tie) {
                setScore(old => ({
                    ...old,
                    tie: old.tie + 1,
                }));

                return;
            }

            setScore(old => {
                const temp = {...old}

                if (turn === Player.Human)
                    temp.bot++;
                else
                    temp.user++;

                return temp;
            });

            setWinner(turn === Player.Human ? 'robot' : 'human');

            return;
        }

        if (turn === Player.Robot) {
            const timer = setTimeout(() => botAction(result), 500);
            return () => clearTimeout(timer);
        }
    }, [turn]);

    const check = (enemyState: CellState) => {
        // first choice for bot
        if (emptyCells.length === 8)
            return randomValue(emptyCells);

        const possible: number[] = [];

        for (let i = 0; i < checks.length; i++) {
            const my: number[] = [],
                enemy: number[] = [],
                empty: number[] = [];

            checks[i].forEach(idx => {
                switch (state[idx]) {
                    case CellState.Empty:
                        empty.push(idx);
                        break;
                    case enemyState:
                        enemy.push(idx);
                        break;
                    default:
                        my.push(idx);
                }
            });

            if (enemy.length === 3 || my.length === 3) {
                return End.Win;
            }

            if ((enemy.length === 2 || my.length === 2) && empty.length === 1) {
                possible.push(empty[0]);
            }
        }

        if (!emptyCells.length)
            return End.Tie;

        if (possible.length)
            // easy mod for everyone! bot can make mistakes
            return randomValue(possible);

        return randomValue(emptyCells);
    };

    const put = (idx: number, type: CellState) => {
        setState(old => replaceItemAtIndex(old, idx, type));
        setEmptyCells(old => old.filter(i => i !== idx));
    };

    const userAction = (x: number, y: number) => {
        if (turn !== Player.Human)
            return;

        put(x*3+y, CellState.Cross);
        setTurn(Player.Robot);
    };

    const botAction = (idx: number) => {
        put(idx, CellState.Circle);
        setTurn(Player.Human);
    };

    const reset = () => {
        setState([...defaultValues]);
        setEmptyCells([...defaultEmpties]);
        setWinner(null);
        setTurn(Player.Human);
        setGameOver(false);
    };

    return {
        gameOver,
        state,
        score,
        winner,
        userAction,
        reset,
    };
};

export default useController;
