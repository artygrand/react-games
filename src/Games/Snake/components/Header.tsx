import React from 'react';
import StartButton from 'components/StartButton';
import useSnakeController, { Settings } from 'Games/Snake/hooks/useSnakeController';


type HeaderProps = {
    settings: Settings
}

const Header = ({ settings }: HeaderProps) => {
    const { curScore, maxScore, gameActive, gameStart } = useSnakeController(settings);

    return (
        <>
            <StartButton active={gameActive} start={gameStart} />

            <div className="score">
                <div>{curScore}</div>
                <div>{maxScore}</div>
            </div>
        </>
    )
}

export default Header;
