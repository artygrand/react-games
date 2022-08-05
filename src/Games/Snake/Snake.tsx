import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
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
    const { curScore, maxScore, gameOver, reset } = useSnakeController(settings);

    return (
        <>
            <div className="score">
                <div>{curScore}</div>
                <div>{maxScore}</div>
            </div>
            {gameOver &&
                <button
                    className="btn btn-again"
                    onClick={reset}
                >
                    {t('again')}
                </button>
            }
        </>
    )
}

Snake.gameName = 'snake';

Snake.locales = {
    en,
    ru,
};

export default Snake;
