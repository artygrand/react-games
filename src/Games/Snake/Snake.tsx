import React from 'react';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'


const Snake: GameData = () => {
    return (
        <div id="game-snake">

        </div>
    );
};

Snake.gameName = 'snake';

Snake.locales = {
    en,
    ru,
};

export default Snake;
