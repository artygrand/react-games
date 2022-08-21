import React, { memo, useCallback } from 'react';
import { CardModel } from 'Games/Concentration/hooks/useConcentrationController';


type CellProps = CardModel & {
    flip: (i: number) => void
};

const Card = memo(({ idx, value, flipped, flip }: CellProps) => {
    const click = useCallback(() => flip(idx), [flip, idx]);

    return (
        <div onClick={click} className={`card${flipped ? ' flipped' : ''}`} >
            <div className="back"></div>
            <div className="face">{value}</div>
        </div>
    );
});

export default Card;
