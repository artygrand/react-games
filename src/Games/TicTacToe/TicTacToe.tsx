import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import Cell from './components/Cell';
import useController, { CellState } from './hooks/useController';


const TicTacToe: GameData = () => {
    const { t } = useTranslation('tic-tac-toe');
    const { gameOver, state, winner, score, userAction, reset } = useController();

    return (
        <div id="game-tic-tac">

            <div className="winner">
                {winner ? <>{t('winner')}: {t(winner)}</> : <br/>}
            </div>

            <div className="score">
                <div>{t('human')}</div>
                <div>{score.user}</div>
                <div>:</div>
                <div>{score.tie}</div>
                <div>:</div>
                <div>{score.bot}</div>
                <div>{t('robot')}</div>
            </div>
            <table style={gameOver ? {pointerEvents: 'none'} : undefined}>
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

            <div className="buttons">
                {gameOver &&
                    <button onClick={reset}>{t('new_game')}</button>
                }
            </div>

        </div>
    );
};

TicTacToe.gameName = 'tic-tac-toe';

TicTacToe.locales = {
    en,
    ru,
};

export default TicTacToe;
