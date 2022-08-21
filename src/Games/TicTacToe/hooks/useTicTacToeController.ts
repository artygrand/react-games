import { useEffect, useReducer, useState } from 'react';
import { randomValue, range, replaceItemAtIndex } from 'utils/common';


export enum CellState {
    Empty,
    Cross,
    Circle,
}

enum End {
    Win = 1,
    NotYet = 0,
    Tie = -1,
}

const defaultValues: CellState[] = Array(9).fill(CellState.Empty);
const defaultEmpties: number[] = range(9);
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

const useTicTacToeController = () => {
    const [ data, setData ] = useState({
        state: [...defaultValues],
        empty: [...defaultEmpties],
    });
    const [ botTurn, newTurn ] = useReducer(bot => !bot, false);
    const [ score, setScore ] = useState({user: 0, tie: 0, bot: 0});
    const [ winner, setWinner ] = useState<number|null>(null);
    const [ gameActive, setGameActive ] = useState(true);

    // after every turn
    useEffect(() => {
        const result = isSomeoneWon();

        if (result === End.NotYet) {
            // only after human turn
            if (botTurn) {
                const timer = setTimeout(() => botAction(botChooseCell()), 500);
                return () => clearTimeout(timer);
            }

            return;
        }

        setGameActive(false);

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

        setWinner(result);
    }, [botTurn]);

    const isSomeoneWon = () => {
        for (let i = 0; i < checks.length; i++) {
            const temp: {[key in CellState]: number[]} = {
                [CellState.Cross]: [],
                [CellState.Circle]: [],
                [CellState.Empty]: [],
            };

            checks[i].forEach(idx => temp[data.state[idx]].push(idx));

            if (temp[CellState.Cross].length === 3 || temp[CellState.Circle].length === 3) {
                return End.Win + i; // magical number for current check
            }
        }

        if (!data.empty.length)
            return End.Tie;

        return End.NotYet;
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

    const botChooseCell = () => {
        // first choice
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
                    case CellState.Cross:
                        enemy.push(idx);
                        break;
                    default:
                        my.push(idx);
                }
            });

            if (empty.length === 1) {
                // easy mode for everyone! bot can make mistakes in just 5%
                if (my.length === 2 && Math.random() >= .05) {
                    return empty[0];
                }

                if (enemy.length === 2) {
                    possible.push(empty[0]);
                }
            }
        }

        if (possible.length)
            return randomValue(possible);

        return randomValue(data.empty);
    };

    const botAction = (idx: number) => {
        put(idx, CellState.Circle);
    };

    const gameStart = () => {
        setData({
            state: [...defaultValues],
            empty: [...defaultEmpties],
        });
        newTurn();
        setWinner(null);
        setGameActive(true);
    };

    return {
        gameActive,
        state: data.state,
        score,
        winner,
        userAction,
        gameStart,
    };
};

export default useTicTacToeController;
