import { HexCell, inverseDirection, Direction } from '../hexCell';
import { coinFlip, D } from '../lib/dice';
import { frontier } from '../lib/frontier';
import { HexGrid } from '../hexGrid';
import { visitStateTracker } from '../lib/visitStateTracker';
import { HexMapOptions } from '../HexMapOptions';

export const setAltitude = (grid: HexGrid, options: HexMapOptions): void => {
    const { hasNotBeenVisited, markVisited } = visitStateTracker(grid.cells());

    const descend = (cells: HexCell[], altitude: number, gradient: number): void => {
        cells.filter(hasNotBeenVisited).forEach((c) => {
            markVisited(c);
            const newAltitude = altitude - (coinFlip() ? D(gradient) : 0);
            c.setAltitude(newAltitude > 1 ? newAltitude : 1);
        });
        const front = frontier(cells).filter(hasNotBeenVisited);
        if (front.length > 0) descend(front, altitude - 1, gradient - 1);
    };

    const mountains = grid.sample(options.peaks);
    mountains.forEach((hex) => {
        markVisited(hex);
        hex.setAltitude(10);
    });

    descend(frontier(mountains), 9, 3);
};
