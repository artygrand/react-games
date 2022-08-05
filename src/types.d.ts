import React from 'react';

export type GameData = React.FC & {
    locales: {
        [key: string]: any
    },
    gameName: string,
    image: string,
};
