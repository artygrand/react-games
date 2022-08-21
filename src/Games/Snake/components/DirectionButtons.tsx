import React from 'react';
import { isDesktop } from 'react-device-detect';

const DirectionButtons = () => {
    if (isDesktop)
        return null;

    const pressKey = (key: string) => document.dispatchEvent(new KeyboardEvent('keydown', { key }));

    return (
        <>
            <div className="pad-bottom"></div>
            <div className="direction-buttons">
                <div onClick={() => pressKey('w')}>&#11014;</div>
                <div onClick={() => pressKey('d')}>&#10145;</div>
                <div onClick={() => pressKey('a')}>&#11013;</div>
                <div onClick={() => pressKey('s')}>&#11015;</div>
            </div>
        </>
    );
};

export default DirectionButtons;
