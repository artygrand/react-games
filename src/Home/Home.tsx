import React from 'react';
import { Link } from 'react-router-dom';
import { GameData } from 'types';
import { useTranslation } from 'react-i18next';


type HomeProps = {
    games: GameData[],
}

const Home = ({ games }: HomeProps) => {
    const { t } = useTranslation();

    return (
        <main>
            <h2>Welcome to the Game center!</h2>

            <div className="games">
                {games.map(g => (
                    <Link key={g.gameName} to={`/${g.gameName}`} className="card">
                        <img src="http://placekitten.com/200/200" alt={g.gameName} />

                        <div className="title">
                            {t(`${g.gameName}:title`)}
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default Home;
