// eslint-disable-next-line import/no-cycle
import { HexCell } from './hexCell';
import { Grid } from './grid';
import { exists } from './lib/exists';
import { shuffle } from './lib/shuffle';

export class HexGrid implements Grid<HexCell> {
    private grid: (HexCell | undefined)[][];

    constructor(grid: (HexCell | undefined)[][] = []) {
        this.grid = grid;
    }

    public cells(): HexCell[] {
        return this.grid.reduce((cells, row) => [...cells, ...row]).filter(exists);
    }

    public at(row: number, column: number): HexCell | undefined {
        if (row < 0 || column < 0) return undefined;
        return (this.grid[row] || [])[column];
    }

    public insert(cell: HexCell): void {
        this.grid[cell.row] = this.grid[cell.row] || [];
        this.grid[cell.row][cell.column] = cell;
    }

    public remove(cell?: HexCell): void {
        if (!cell) return;
        (this.grid[cell.row] || [])[cell.column] = undefined;
    }

    public sample(max: number): HexCell[] {
        return shuffle(this.cells()).slice(0, max);
    }

    public linkCells(): void {
        this.cells().forEach((c) => {
            const rowOffset = c.column % 2 === 0 ? -1 : 0;

            const topNeighbour = this.at(c.row - 1, c.column);
            const topRightNeighbour = this.at(c.row + rowOffset, c.column + 1);
            const bottomRightNeighbour = this.at(c.row + rowOffset + 1, c.column + 1);
            const bottomNeighbour = this.at(c.row + 1, c.column);
            const bottomLeftNeighbour = this.at(c.row + rowOffset + 1, c.column - 1);
            const topLeftNeighbour = this.at(c.row + rowOffset, c.column - 1);

            c.linkTop(topNeighbour);
            c.linkTopRight(topRightNeighbour);
            c.linkBottomRight(bottomRightNeighbour);
            c.linkBottom(bottomNeighbour);
            c.linkBottomLeft(bottomLeftNeighbour);
            c.linkTopLeft(topLeftNeighbour);
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public toJson() {
        return this.cells().map((c) => c.toJson());
    }

    static build(height: number, width: number): HexGrid {
        const grid = new HexGrid();

        for (let row = 0; row < height; row += 1) {
            for (let column = 0; column < width; column += 1) {
                grid.insert(new HexCell(row, column));
            }
        }

        grid.linkCells();

        return grid;
    }
}
