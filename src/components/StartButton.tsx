import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from "react-i18next";


type StartButtonProps = {
    active: boolean,
    start: () => void,
}

const StartButton = ({ active, start }: StartButtonProps) => {
    const { t } = useTranslation();

    return (
        <CSSTransition
            in={!active}
            timeout={700}
            classNames="floating"
            unmountOnExit
        >
            <div className="floating-button">
                <button className="btn" onClick={start}>
                    {t('new_game')}
                </button>
            </div>
        </CSSTransition>
    );
};

export default StartButton;
