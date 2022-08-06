import React from 'react';
import { CardModel } from 'Games/Concentration/hooks/useConcentrationController';
import Card from 'Games/Concentration/components/Card';


type DeckProps = {
    cards: CardModel[],
    inRow: number,
    flip: (i: number) => void,
}

const Deck = React.memo(({cards, inRow, flip}: DeckProps) => {
    return (
        <div className="deck" style={{gridTemplateColumns: `repeat(${inRow}, 1fr)`}}>
            {cards.map((card, i) => <Card key={i} {...card} onClick={() => flip(i)} />)}
        </div>
    )
});

export default Deck;
