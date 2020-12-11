import React from 'react';
import { CellStatus } from '../Domain/Cell';
import "./Cell.css"

type CellProps = {
    status: CellStatus;
    onclick: Function;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};


export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div className={`cell cell--${props.status}`}
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
        >
            <span className={`cell__txt ${props.status !== "untouched" && "cell__txt--active"}`}>
                {emojis[props.status]}
            </span>

        </div>
    );
};
