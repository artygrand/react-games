import React from 'react';
import { RecoilRoot } from 'recoil';
import { isMobile } from 'react-device-detect';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import image from './fruit.png';
import Field from './components/Field';
import Score from './components/Score';


const settings = {
    width: isMobile ? 6 : 12,
    height: isMobile ? 12 : 10,
};

const FruitRow: GameData = () => {
    const width = Math.min(window.innerWidth - 32, 720);
    const height = width / settings.width * settings.height;

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
