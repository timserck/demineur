import React, { Fragment } from 'react';

type GameProps = {
    gameOver: false | 'victory' | 'defeat';
};

export const Game: React.FunctionComponent<GameProps> = props => {
    return (
        <Fragment>
            {props.gameOver && (
                <div className={`result ${props.gameOver && 'result--active'}`}>
                    <strong className={`result__txt result__txt--${props.gameOver}`}>
                        {props.gameOver}
                    </strong>
                    <button className={`result__btn`} onClick={(e) => document.location.reload()}>Play Again</button>
                </div>
            )}
        </Fragment>
    )
};
