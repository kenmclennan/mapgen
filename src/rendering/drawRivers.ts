import * as svg from '@svgdotjs/svg.js';
import { HexMapOptions } from '../HexMapOptions';
import { River } from '../generator/rivers';
import { toCoordinates } from './cellCoordinates';
import { HexCell, Direction } from '../hexCell';

export const drawRivers = (canvas: svg.Svg, options: HexMapOptions) => (river: River): void => {
    const coords = toCoordinates(options.hexSize);
    const points = river.course.map(coords).map(({ centerX, centerY }) => [centerX, centerY]);

    if (river.exitsMap()) {
        const exitCell = river.last() as HexCell;
        const direction = river.exitDirection as Direction;
        points.push(coords(exitCell)[direction].middle);
    }

    canvas
        .polyline(points.reduce((a, b) => [...a, ...b], []))
        .fill('none')
        .stroke({
            width: options.riverWidth,
            color: 'blue',
        });
};
