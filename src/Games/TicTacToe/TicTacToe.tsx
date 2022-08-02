import React, { useState } from 'react';
import { GameData } from 'types';
import en from './locales/en';
import ru from './locales/ru';
import './main.scss'


const TicTacToe: GameData = () => {
    const [ state, setState ] = useState();

    return (
        <div id="game-tic-tac">
            <table>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

TicTacToe.gameName = 'tic-tac-toe';

TicTacToe.locales = {
    en,
    ru,
};

export default TicTacToe;
