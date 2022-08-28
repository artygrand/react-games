import React from 'react';
import { useRecoilValue } from 'recoil';
import { scoreAtom } from 'Games/CowTrain/atoms/score';
import { minifyNumber } from 'utils/common';

const Score = () => {
    const score = useRecoilValue(scoreAtom);

    const formatted = score > 1000000000000 ? minifyNumber(score) : Math.floor(score).toLocaleString();
    return (
        <div className="score">💰 {formatted}</div>
    );
};

export default Score;
