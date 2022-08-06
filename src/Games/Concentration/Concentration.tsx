import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import image from './concentration.png';
import useConcentrationController  from './hooks/useConcentrationController';
import Deck from 'Games/Concentration/components/Deck';


const Concentration: GameData = () => {
    const { t } = useTranslation('concentration');
    const { moves, score, timer, gameActive, cards, cardsInRow, flip, gameStart } = useConcentrationController();

    return (
        <div id="game-concentration">
            {!gameActive &&
                <div className="floating-button">
                    <button className="btn" onClick={gameStart}>
                        {t('start')}
                    </button>
                </div>
            }

            <div className="score">
                <div>{t('moves')}: <strong>{moves}</strong></div>
                <div>{t('score')}: <strong>{score}</strong></div>
                <div>{t('timer')}: <strong>{timer}</strong></div>
            </div>

            <Deck cards={cards} inRow={cardsInRow} flip={flip}/>
        </div>
    );
};

Concentration.gameName = 'concentration';
Concentration.image = image;
Concentration.locales = {
    en,
    ru,
};

export default Concentration;
