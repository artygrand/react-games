import React from 'react';
import { GameData } from 'types';
import StartButton from 'components/StartButton';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'
import image from './tic-tac-toe.png';
import Cell from './components/Cell';
import Header from './components/Header';
import useTicTacToeController, { CellState } from './hooks/useTicTacToeController';


const TicTacToe: GameData = () => {
    const { gameActive, state, winner, score, userAction, gameStart } = useTicTacToeController();

    return (
        <div id="game-tic-tac">
            <StartButton active={gameActive} start={gameStart} />

            <Header {...score} />

            <div className="line-wrapper">
                <div className={winner !== null ? `win line-${winner}` : undefined} />

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
