import React, { Suspense } from 'react';
import useCowTrainController from 'Games/CowTrain/hooks/useCowTrainController';
import MemberCard from 'Games/CowTrain/components/MemberCard';
import Score from 'Games/CowTrain/components/Score';
import Cows from 'Games/CowTrain/components/Cows';
import Background from 'Games/CowTrain/components/Background';
import Money from 'Games/CowTrain/components/Money';

const Game = () => {
    const { members, click, promote } = useCowTrainController();
    const availableForHire = members.filter(m => m.available);
    const banknotesPerTick = Math.ceil((members.filter(m => m.level > 0).length - 1) / 3);

    return (
        <div className="row">
            <div className="column">
                <Suspense fallback="0">
                    <Score />
                </Suspense>

                <div onClick={click} className="field">
                    <Background />
                    <Cows maxLength={availableForHire.length} />
                    <Money count={banknotesPerTick} />
                </div>
            </div>

            <div className="column">
                <table>
                    <tbody>
                    {availableForHire.map(m => (
                        <MemberCard
                            key={m.idx}
                            member={m}
                            promote={promote}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Game;
