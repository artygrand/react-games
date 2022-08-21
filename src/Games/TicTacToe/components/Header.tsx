import React from 'react';
import { useTranslation } from 'react-i18next';


type HeaderProps = {
    user: number,
    tie: number,
    bot: number,
}

const Header = (score: HeaderProps) => {
    const { t } = useTranslation('tic-tac-toe');

    return (
        <div className="score">
            <div>{t('human')}</div>
            <div>{score.user}</div>
            <div>:</div>
            <div>{score.tie}</div>
            <div>:</div>
            <div>{score.bot}</div>
            <div>{t('robot')}</div>
        </div>
    );
};

export default Header;
