import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import image from './tic-tac-toe.png';
import Cell from './components/Cell';
import useTicTacToeController, { CellState } from './hooks/useTicTacToeController';


const TicTacToe: GameData = () => {
    const { t } = useTranslation('tic-tac-toe');
    const { gameActive, state, winner, score, userAction, gameStart } = useTicTacToeController();

    return (
        <div id="game-tic-tac">
            <div className="score">
                <div>{t('human')}</div>
                <div>{score.user}</div>
                <div>:</div>
                <div>{score.tie}</div>
                <div>:</div>
                <div>{score.bot}</div>
                <div>{t('robot')}</div>
            </div>

            {!gameActive &&
                <div className="floating-button">
                    <button className="btn" onClick={gameStart}>
                        {t('start')}
                    </button>
                </div>
            }

            <div className="line-wrapper">
                <div className={winner !== null ? `win line${winner}` : undefined} />

                <table style={!gameActive ? {pointerEvents: 'none'} : undefined}>
                    <tbody>
                    {[0, 1, 2].map(x => (
                        <tr key={x}>
                            {[0, 1, 2].map(y => {
                                const idx = x * 3 + y;

                                return (
                                    <Cell
                                        key={y}
                                        idx={idx}
                                        onClick={state[idx] === CellState.Empty ? () => userAction(x, y) : undefined}
                                        state={state[idx]}
                                    />
                                )
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

TicTacToe.gameName = 'tic-tac-toe';
TicTacToe.image = image;
TicTacToe.locales = {
    en,
    ru,
};

export default TicTacToe;
