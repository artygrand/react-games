import { useEffect, useReducer, useState } from 'react';
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
    const [ data, setData ] = useState({
        state: [...defaultValues],
        empty: [...defaultEmpties],
    });
    const [ botTurn, newTurn ] = useReducer(bot => !bot, false);
    const [ score, setScore ] = useState({user: 0, tie: 0, bot: 0});
    const [ winner, setWinner ] = useState<string|null>(null);
    const [ gameOver, setGameOver ] = useState(false);

    useEffect(() => {
        // someone won or bot can choose any empty cell
        const result = check(botTurn ? CellState.Cross : CellState.Circle);

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

                if (botTurn)
                    temp.user++;
                else
                    temp.bot++;

                return temp;
            });

            setWinner(botTurn ? 'human' : 'robot');

            return;
        }

        if (botTurn) {
            const timer = setTimeout(() => botAction(result), 500);
            return () => clearTimeout(timer);
        }
    }, [botTurn]);

    const check = (enemyState: CellState) => {
        // first choice for bot
        if (data.empty.length > 7)
            return randomValue(data.empty);

        const possible: number[] = [];

        for (let i = 0; i < checks.length; i++) {
            const my: number[] = [],
                enemy: number[] = [],
                empty: number[] = [];

            checks[i].forEach(idx => {
                switch (data.state[idx]) {
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

            if (enemy.length === 2 && empty.length === 1) {
                possible.push(empty[0]);
            }

            if (my.length === 2 && empty.length === 1) {
                // twice more chances to choose right decision
                possible.push(empty[0], empty[0]);
            }
        }

        if (!data.empty.length)
            return End.Tie;

        if (possible.length)
            // easy mode for everyone! bot can make mistakes
            return randomValue(possible);

        return randomValue(data.empty);
    };

    const put = (idx: number, type: CellState) => {
        setData(old => ({
            state: replaceItemAtIndex(old.state, idx, type),
            empty: old.empty.filter(i => i !== idx),
        }));

        newTurn();
    };

    const userAction = (x: number, y: number) => {
        if (!botTurn)
            put(x*3+y, CellState.Cross);
    };

    const botAction = (idx: number) => {
        put(idx, CellState.Circle);
    };

    const reset = () => {
        setData({
            state: [...defaultValues],
            empty: [...defaultEmpties],
        });
        newTurn();
        setWinner(null);
        setGameOver(false);
    };

    return {
        gameOver,
        state: data.state,
        score,
        winner,
        userAction,
        reset,
    };
};

export default useController;
