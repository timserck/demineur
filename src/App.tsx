import React from 'react';
import { render } from 'react-dom/index';
import { GameContextProvider } from './GameContext';
import { Grid } from './Components/Grid';
import '../src/styles/reset.css'
import '../src/styles/keyframes.css'
const App = () => {
    return (
        <GameContextProvider>
            <Grid />
        </GameContextProvider>
    );
};

const node = document.getElementById('root');
render(React.createElement(App), node);