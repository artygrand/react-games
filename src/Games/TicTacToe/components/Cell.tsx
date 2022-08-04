import React from 'react';
import { CellState } from 'Games/TicTacToe/hooks/useController';


type CellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
    state: CellState,
    idx: number,
}

const content = {
    [CellState.Cross]: (i: number) => <div className={`cross move${i}`}></div>,
    [CellState.Circle]: (i: number) => <div className={`circle move${i}`}></div>,
    [CellState.Empty]: () => null,
}

const Cell = ({ idx, state, ...props }: CellProps) => {
    return (
        <td {...props}>
            {content[state](idx % 4)}
        </td>
    );
};

export default Cell;
