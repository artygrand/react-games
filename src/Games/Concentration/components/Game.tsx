import React from 'react';
import { RecoilRoot } from 'recoil';
import GameInner from 'Games/Concentration/components/GameInner';
import { CardGameSettings } from 'Games/Concentration/hooks/useConcentrationController';


type ConcentrationGameProps = {
    settings: CardGameSettings
}

const Game = ({ settings }: ConcentrationGameProps) => {
    return (
        <div id="game-concentration">
            <RecoilRoot>
                <GameInner settings={settings} />
            </RecoilRoot>
        </div>
    );
};

export default Game;
