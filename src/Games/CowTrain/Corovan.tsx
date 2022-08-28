import React from 'react';
import { RecoilRoot } from 'recoil';
import { GameData } from 'types';
import image from './corovan.png';
import './main.scss'
import en from './locales/en';
import ru from './locales/ru';
import Game from './components/Game';

const Corovan: GameData = () => {
    return (
        <div id="game-cow-train">
            <RecoilRoot>
                <Game />
            </RecoilRoot>
        </div>
    );
};

Corovan.gameName = 'cow-train';
Corovan.image = image;
Corovan.locales = {
    en,
    ru,
};

export default Corovan;
