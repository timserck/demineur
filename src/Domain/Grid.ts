import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Grid {
    [key: number]: number;
    private _column: number;
    private _row: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];
            cells[rand] = cells[index];
            cells[index] = cell;
        }
        return new Grid(column, cells, row);
    }

    constructor(column: number, cells: Cells, row: number) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (!Number.isInteger(row)) {
            throw new TypeError('row count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }
        this._column = column;
        this._row = row;
        this._cells = cells;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    map(
        callbackfn: (value: Cell, index: number, array: Cell[]) => {},
        thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoodinates(x: number, y: number): Cell | undefined {
        return this._cells[this._column * y + x];
    }

    nbrBombNear(x: number, y: number, cellIndex: number, cells: Cells) {
        let nbrBombNear = 0

        this.cellByCoodinates(x + 1, y)?.bomb === true && x < this.row - 1 && x + 1 >= 0 ? nbrBombNear++ : null
        this.cellByCoodinates(x - 1, y)?.bomb === true && x < this.row - 1 && x - 1 >= 0 ? nbrBombNear++ : null
        this.cellByCoodinates(x, y + 1)?.bomb === true && y < this.column && y + 1 >= 0 ? nbrBombNear++ : null
        this.cellByCoodinates(x, y - 1)?.bomb === true && y < this.column && y - 1 >= 0 ? nbrBombNear++ : null

        if (!cells[cellIndex].bomb) {
            cells[cellIndex].nextBomb = nbrBombNear;
        }

    }

    convertCoordinatesToIndex(x: number, y: number): number {
        return this._column * y + x
    }

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];
        cells[cellIndex] = cell[action]();
        const x = (cellIndex % this._column);
        const y = Math.floor(cellIndex / this._column);
        this.nbrBombNear((x), y, cellIndex, cells)
        this.expandDig(x, y, cellIndex, cells, cell)
        return new Grid(this._column, cells, this._row);
    }

    expandDig(x: number, y: number, cellIndex: number, cells: Cells, cell: Cell) {

        if (!cells[cellIndex].bomb) {
            for (var i = 0; i < (this._row - x) - 1; i++) {
                let currentCell = cells[(this.convertCoordinatesToIndex(x + i, y)) + 1]
                if (currentCell) {
                    if (currentCell?.bomb === true) {
                        break;
                    }
                    cells[(this.convertCoordinatesToIndex(x + i, y)) + 1] = cell['dig']();
                    this.nbrBombNear((x + i) + 1, y, (this.convertCoordinatesToIndex(x + i, y) + 1), cells)
                }
            }
            for (var i = x; i > 0; i--) {
                let currentCell = cells[(this.convertCoordinatesToIndex(i - 1, y))]
                if (currentCell?.bomb === true) {
                    break;
                }
                cells[(this.convertCoordinatesToIndex(i - 1, y))] = cell['dig']();
                this.nbrBombNear(i - 1, y, (this.convertCoordinatesToIndex(i - 1, y)), cells)
            }
            for (var i = 0; i < (this._column - y); i++) {
                let currentCell = cells[(this.convertCoordinatesToIndex(x, y + i))]

                if (currentCell?.bomb === true) {
                    break;
                }
                cells[(this.convertCoordinatesToIndex(x, y + i))] = cell['dig']();
                this.nbrBombNear(x, (y + i), (this.convertCoordinatesToIndex(x, y + i)), cells)
            }
            for (var i = y; i > 0; i--) {
                let currentCell = cells[(this.convertCoordinatesToIndex(x, i - 1))]
                if (currentCell?.bomb === true) {
                    break;
                }
                cells[(this.convertCoordinatesToIndex(x, i - 1))] = cell['dig']();
                this.nbrBombNear(x, (i - 1), (this.convertCoordinatesToIndex(x, i - 1)), cells)
            }
        }
    }

    isDefeated = () => {
        for (let cell of this) {
            if (cell.detonated === true) return true;
        }
        return false;
    };

    isVictorious = () => {
        for (let cell of this) {
            if (
                (cell.flagged === true && cell.bomb === false) ||
                (cell.detonated === true) ||
                (cell.status === "untouched")
            ) {
                return false;
            }
        }
        return true;
    };

    get column() {
        return this._column;
    }
    get row() {
        return this._row;
    }
}
