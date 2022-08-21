import React from 'react';
import StartButton from 'components/StartButton';
import useConcentrationController, { CardGameSettings } from 'Games/Concentration/hooks/useConcentrationController';
import Deck from 'Games/Concentration/components/Deck';
import Header from 'Games/Concentration/components/Header';


type GameProps = {
    settings: CardGameSettings
}

const GameInner = ({ settings }: GameProps) => {
    const { gameActive, cards, flip, gameStart } = useConcentrationController(settings);

    return (
        <>
            <StartButton active={gameActive} start={gameStart} />

            <Header />

            <Deck cards={cards} cols={settings.cols} flip={flip} />
        </>
    );
};

export default GameInner;
