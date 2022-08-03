import React from 'react';
import { CellState } from 'Games/TicTacToe/hooks/useController';


type CellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
    state: CellState,
}

const content = {
    [CellState.Cross]: <div className="cross"></div>,
    [CellState.Circle]: <div className="circle"></div>,
    [CellState.Empty]: null,
}

const Cell = ({ state, ...props }: CellProps) => {
    return (
        <td {...props}>
            {content[state]}
        </td>
    );
};

export default Cell;
