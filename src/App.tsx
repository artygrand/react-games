import React, { createElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import i18n from 'utils/i18n';
import Home  from 'Home/Home';
import TicTacToe from 'Games/TicTacToe/TicTacToe';
import Snake from 'Games/Snake/Snake';


const games = [
     TicTacToe,
     Snake,
];

games.forEach(g => {
    Object.entries(g.locales).forEach(locale => {
        i18n.addResourceBundle(locale[0], g.gameName, locale[1]);
    })
});


const App = () => {
  return (
    <div className="app">
        <Routes>
            <Route path="/" element={<Home games={games} />} />
            {games.map(g => (
                <Route
                    key={g.gameName}
                    path={g.gameName}
                    element={createElement(g)}
                />
            ))}
        </Routes>
    </div>
  );
};

export default App;
