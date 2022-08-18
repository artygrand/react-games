import React from 'react';
import { useRecoilValue } from 'recoil';
import { cellFamily } from 'Games/FruitRow/atoms/cellFamily';


type CellProps = {
    id: number,
}

const Cell = ({ id }: CellProps) => {
    const cell = useRecoilValue(cellFamily(id));

    const style = {
        width: `${cell.size}%`,
        left: `${cell.xPos}%`,
        top: `${cell.yPos}%`,
    };

    return (
        <div
            id={`${id}`}
            style={style}
        >
            <div>
                {cell.value}
            </div>
        </div>
    );
};

export default Cell;
