import React from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { movesAtom } from 'Games/Concentration/atoms/moves';
import { scoreAtom } from 'Games/Concentration/atoms/score';
import { timerAtom } from 'Games/Concentration/atoms/timer';
import { timerToReadable } from 'utils/common';

const Header = () => {
    const { t } = useTranslation('concentration');
    const moves = useRecoilValue(movesAtom);
    const score = useRecoilValue(scoreAtom);
    const timer = useRecoilValue(timerAtom);

    return (
        <div className="score">
            <div>{t('moves')}: <strong>{moves}</strong></div>
            <div>{t('score')}: <strong>{score}</strong></div>
            <div>{t('timer')}: <strong>{timerToReadable(timer)}</strong></div>
        </div>
    );
};

export default Header;
