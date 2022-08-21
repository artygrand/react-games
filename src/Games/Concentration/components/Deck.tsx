import React from 'react';
import { CardModel } from 'Games/Concentration/hooks/useConcentrationController';
import Card from 'Games/Concentration/components/Card';


type DeckProps = {
    cards: CardModel[],
    cols: number,
    flip: (i: number) => void,
}

const Deck = React.memo(({cards, cols, flip}: DeckProps) => {
    return (
        <div className="deck" style={{gridTemplateColumns: `repeat(${cols}, 1fr)`}}>
            {cards.map(card => <Card key={card.idx} {...card} flip={flip} />)}
        </div>
    )
});

export default Deck;
