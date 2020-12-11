import React, { useEffect } from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';
import './Grid.css'

export const Grid: React.FunctionComponent = () => {

    const { grid, updateGridCellStatus } = React.useContext(GameContext);

    useEffect(() => {
        let root = document.documentElement;
        root.style.setProperty('--gridColumn', `${grid.column}`);
        root.style.setProperty('--gridRow', `${grid.row}`);
    }, []);


    const handleClick = (index: number, button: number) => {
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const gameOver =
        (grid.isDefeated() && 'defeat') ||
        (grid.isVictorious() && 'victory') ||
        false;

    return (
        <main className="game">
            <Game gameOver={gameOver} />
            <div className="grid" >
                {grid.map((cell, index) => (
                    <Cell
                        key={index}
                        nextBomb={cell.nextBomb}
                        status={cell.status}
                        onclick={(ev: MouseEvent) =>
                            handleClick(index, ev.button)
                        }
                    />
                ))}
            </div>
        </main>
    );
};
