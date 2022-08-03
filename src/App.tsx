import React, { createElement } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import i18n from 'utils/i18n';
import common_en from 'locales/en';
import common_ru from 'locales/ru';
import Home  from 'Home/Home';
import TicTacToe from 'Games/TicTacToe/TicTacToe';
import Snake from 'Games/Snake/Snake';


const games = [
     TicTacToe,
     Snake,
];

i18n.addResourceBundle('en', 'common', common_en);
i18n.addResourceBundle('ru', 'common', common_ru);

games.forEach(g => {
    Object.entries(g.locales).forEach(locale => {
        i18n.addResourceBundle(locale[0], g.gameName, locale[1]);
    })
});


const App = () => {
    return (
        <>
            <Routes>
                <Route path="/:any" element={<Link to="/" className="back-button">&times;</Link>}/>
            </Routes>

            <div className="app">
                <Routes>
                    <Route path="/" element={<Home games={games}/>}/>
                    {games.map(g => (
                        <Route
                            key={g.gameName}
                            path={g.gameName}
                            element={createElement(g)}
                        />
                    ))}
                </Routes>
            </div>
        </>
    );
};

export default App;
