import React from 'react';
import { RecoilRoot } from 'recoil';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import image from './fruit.png';
import Field from './components/Field';
import Score from './components/Score';



const FruitRow: GameData = () => {
    const width = Math.min(window.innerWidth - 32, 720);
    const height = Math.min(window.innerHeight - 120, 720);
    const cols = Math.floor(width / 50);
    const rows = Math.floor(height / 50);

    const settings = {
        cols,
        rows,
    };

    return (
        <div id="game-fruit-row">
            <RecoilRoot>
                <Score />
                <Field
                    settings={settings}
                    width={width}
                    height={height}
                />
            </RecoilRoot>
        </div>
    );
};


FruitRow.gameName = 'fruit-row';
FruitRow.image = image;
FruitRow.locales = {
    en,
    ru,
};

export default FruitRow;
