import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameData } from 'types';
import StartButton from 'components/StartButton';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import image from './snake.png';
import useSnakeController from './hooks/useSnakeController';


const settings = {
    width: 24,
    height: 24,
    tickDelay: 250, // ms
};

const Snake: GameData = () => {
    const cells = Array.from(Array(settings.width * settings.height).keys());

    return (
        <div id="game-snake">
            <Score />
            <div className="field" style={{gridTemplateColumns: `repeat(${settings.width}, 1fr)`}}>
                {cells.map(i => <div key={i} />)}
            </div>
        </div>
    );
};

const Score = () => {
    const { t } = useTranslation('snake');
    const { curScore, maxScore, gameActive, gameStart } = useSnakeController(settings);

    return (
        <>
            <div className="score">
                <div>{curScore}</div>
                <div>{maxScore}</div>
            </div>

            <StartButton active={gameActive} start={gameStart} />
        </>
    )
}

Snake.gameName = 'snake';
Snake.image = image;
Snake.locales = {
    en,
    ru,
};

export default Snake;
