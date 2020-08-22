import { HexGrid } from './hexGrid';
import { canvas } from './rendering/canvas';
import { drawCellBaseColour, drawGrid, drawLabels, drawAltitude } from './rendering/drawCell';
import { HexMapOptions } from './hexMapOptions';
import { setAltitude } from './generator/terrain';
import { addRivers } from './generator/rivers';
import { drawRivers } from './rendering/drawRivers';

export class HexMap {
    public grid: HexGrid;

    public options: HexMapOptions;

    constructor(options: HexMapOptions) {
        this.options = options;
        this.grid = HexGrid.build(options.height, options.width);
    }

    public toSvg(): string {
        const document = canvas();
        document.font('size', this.options.fontSize);
        document.font('anchor', 'middle');

        setAltitude(this.grid, this.options);
        addRivers(this.grid, this.options);

        this.grid.cells().forEach(drawCellBaseColour(document, this.options));
        this.grid
            .cells()
            .filter((cell) => cell.isRiverSource())
            .reduce((rivers, cell) => [...rivers, ...cell.rivers], [])
            .forEach(drawRivers(document, this.options));
        this.grid.cells().forEach(drawGrid(document, this.options));
        this.grid.cells().forEach(drawLabels(document, this.options));
        this.grid.cells().forEach(drawAltitude(document, this.options));
        return document.svg();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public toJson() {
        return {
            options: this.options,
            grid: this.grid.toJson(),
            rivers: this.grid
                .cells()
                .filter((cell) => cell.isRiverSource())
                .reduce((rivers, cell) => [...rivers, ...cell.rivers], [])
                .map((river) => river.toJson()),
        };
    }
}
