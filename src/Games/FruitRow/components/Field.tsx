import React from 'react';
import useFruitRowController, { Settings } from 'Games/FruitRow/hooks/useFruitRowController';
import Cell from 'Games/FruitRow/components/Cell';


type FieldProps = {
    settings: Settings,
    width: number,
    height: number,
};

const Field = ({ settings, width, height }: FieldProps) => {
    const { cells, fieldRef } = useFruitRowController(settings);

    return (
        <div className="field" ref={fieldRef} style={{width: width, height: height}}>
            {cells.map(id => <Cell key={id} id={id} />)}
        </div>
    )
}

export default Field;
