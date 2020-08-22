import * as svg from '@svgdotjs/svg.js';
import { HexCell } from '../hexCell';
import { padZero } from '../lib/pad';
import { toCoordinates, toPoints } from './cellCoordinates';
import { HexMapOptions } from '../HexMapOptions';

const getBaseColour = (altitude: number): string => {
    if (altitude === 10) return 'white';
    if (altitude === 9) return 'brown';
    if (altitude > 6) return 'orange';
    return 'green';
};

export const drawCellBaseColour = (canvas: svg.Svg, options: HexMapOptions) => (cell?: HexCell): void => {
    if (!cell) return;
    const points = toPoints(options.hexSize)(cell);
    const baseColour = cell.flooded ? 'blue' : getBaseColour(cell.altitude);
    canvas.polygon(points).fill(baseColour);
};

export const drawLabels = (canvas: svg.Svg, options: HexMapOptions) => (cell?: HexCell): void => {
    if (!cell) return;
    const coords = toCoordinates(options.hexSize)(cell);
    const pad = padZero(String(Math.max(options.height, options.width)).length);
    const label = canvas.plain(cell.gridPosition().map(pad).join(''));
    label.amove(coords.centerX, coords.centerY + options.hexSize - options.fontSize);
};

export const drawAltitude = (canvas: svg.Svg, options: HexMapOptions) => (cell?: HexCell): void => {
    if (!cell) return;
    const coords = toCoordinates(options.hexSize)(cell);
    const elevation = canvas.plain(String(cell.altitude));
    elevation.amove(coords.centerX, coords.centerY - options.hexSize + options.fontSize * 2);
};

export const drawGrid = (canvas: svg.Svg, options: HexMapOptions) => (cell?: HexCell): void => {
    if (!cell) return;
    const points = toPoints(options.hexSize)(cell);
    canvas.polygon(points).fill('none').stroke({ width: options.lineWidth, color: 'black' });
};
