import React from 'react';
import { useTranslation } from 'react-i18next';
import { Member } from 'Games/CowTrain/hooks/useCowTrainController';
import { minifyNumber } from 'utils/common';


type MemberCardProps = {
    member: Member,
    promote: (idx: number) => void,
}

const MemberCard = ({ member, promote }: MemberCardProps) => {
    const { t } = useTranslation('cow-train');

    return (
        <tr className={`member-card ${member.canPromote ? '' : 'disabled'}`} onClick={() => promote(member.idx)}>
            <td>
                <span className="avatar">{member.avatar}</span> {t(member.name)}
            </td>
            <td className="text-end">
                ${minifyNumber(member.price)}
            </td>
            <td className="text-end">
                <span className="power">{minifyNumber(member.power)}</span>
                &times;
                <span className="level">{member.level}</span>
            </td>
        </tr>
    );
};

export default MemberCard;
