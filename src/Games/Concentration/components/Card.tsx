import React from 'react';
import { CardModel } from 'Games/Concentration/hooks/useConcentrationController';


type CellProps = React.HTMLAttributes<HTMLDivElement> & CardModel;

const Card = ({ value, flipped, ...props }: CellProps) => {
    return (
        <div {...props} className={`card${flipped ? ' flipped' : ''}`} >
            <div className="back"></div>
            <div className="face">{value}</div>
        </div>
    );
};

export default Card;
