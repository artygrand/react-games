import React from 'react';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import image from './concentration.png';
import Game from './components/Game';


const Concentration: GameData = () => {
    const width = Math.min(window.innerWidth - 32, 640);
    const height = Math.min(window.innerHeight - 120, 560);
    const cols = Math.floor(width / 80);
    const rows = Math.ceil(height / 120);

    const settings = {
        pairCount: rows * cols / 2,
        cols,
        flipTime: 500,
    };

    return (
        <Game settings={settings} />
    );
};

Concentration.gameName = 'concentration';
Concentration.image = image;
Concentration.locales = {
    en,
    ru,
};

export default Concentration;
