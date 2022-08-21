import React from 'react';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import image from './snake.png';
import DirectionButtons from 'Games/Snake/components/DirectionButtons';
import Header from 'Games/Snake/components/Header';


const settings = {
    width: 24,
    height: 24,
    tickDelay: 250, // ms
};

const Snake: GameData = () => {
    const cells = Array.from(Array(settings.width * settings.height).keys());

    return (
        <div id="game-snake">
            <Header settings={settings} />
            <div className="field" style={{gridTemplateColumns: `repeat(${settings.width}, 1fr)`}}>
                {cells.map(i => <div key={i} />)}
            </div>

            <DirectionButtons />
        </div>
    );
};

Snake.gameName = 'snake';
Snake.image = image;
Snake.locales = {
    en,
    ru,
};

export default Snake;
