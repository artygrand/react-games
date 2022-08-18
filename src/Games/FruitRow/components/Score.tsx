import React from 'react';
import { useRecoilValue } from 'recoil';
import { scoreAtom } from 'Games/FruitRow/atoms/score';

const Score = () => {
    const score = useRecoilValue(scoreAtom);

    return (
        <div className="score">
            {score}
        </div>
    );
};

export default Score;
