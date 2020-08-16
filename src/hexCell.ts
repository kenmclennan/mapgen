import { v4 as uuid } from 'uuid';
import { any } from './lib/any';
import { uniq } from './lib/uniq';
// eslint-disable-next-line import/no-cycle
import { River } from './generator/river2';

export type Direction = 'top' | 'topRight' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'topLeft';

export const inverseDirection = (direction: Direction): Direction => {
    switch (direction) {
        case 'top':
            return 'bottom';
        case 'topRight':
            return 'bottomLeft';
        case 'bottomRight':
            return 'topLeft';
        case 'bottom':
            return 'top';
        case 'bottomLeft':
            return 'topRight';
        case 'topLeft':
        default:
            return 'bottomRight';
    }
};

export class HexCell {
    public id: string;

    public row: number;

    public column: number;

    public topLeft?: HexCell;

    public top?: HexCell;

    public topRight?: HexCell;

    public bottomRight?: HexCell;

    public bottom?: HexCell;

    public bottomLeft?: HexCell;

    public altitude: number;

    public terrain: string;

    public rivers: River[];

    public riversIn: Direction[];

    public riversOut: Direction[];

    public flooded: boolean;

    constructor(row: number, column: number) {
        this.id = uuid();
        this.row = row;
        this.column = column;
        this.altitude = 0;
        this.riversIn = [];
        this.riversOut = [];
        this.flooded = false;
    }

    public flood(): void {
        this.flooded = true;
    }

    public setAltitude(altitude: number): void {
        this.altitude = altitude;
    }

    public addRiver(river: River): void {
        this.rivers = uniq([...this.rivers, river]);
    }

    public hasRiver(): boolean {
        return any(this.rivers);
    }

    public addRiverIn(direction: Direction): void {
        this.riversIn.push(direction);
    }

    public addRiverOut(direction: Direction): void {
        this.riversOut.push(direction);
    }

    public linkTop(cell?: HexCell): void {
        this.top = cell;
    }

    public linkTopRight(cell?: HexCell): void {
        this.topRight = cell;
    }

    public linkBottomRight(cell?: HexCell): void {
        this.bottomRight = cell;
    }

    public linkBottom(cell?: HexCell): void {
        this.bottom = cell;
    }

    public linkBottomLeft(cell?: HexCell): void {
        this.bottomLeft = cell;
    }

    public linkTopLeft(cell?: HexCell): void {
        this.topLeft = cell;
    }

    public neighbours(): (HexCell | undefined)[] {
        return [this.top, this.topRight, this.bottomRight, this.bottom, this.bottomLeft, this.topLeft];
    }

    public neighboursWithDirection(): [Direction, HexCell | undefined][] {
        return [
            ['top', this.top],
            ['topRight', this.topRight],
            ['bottomRight', this.bottomRight],
            ['bottom', this.bottom],
            ['bottomLeft', this.bottomLeft],
            ['topLeft', this.topLeft],
        ];
    }

    public neighbourInDirection(direction: Direction): HexCell | undefined {
        const n = this.neighboursWithDirection().find(([d, _cell]) => direction === d);
        return n ? n[1] : n;
    }

    public gridPosition(): [number, number] {
        return [this.row, this.column];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public toJson() {
        return {
            id: this.id,
            gridPosition: this.gridPosition().join(','),
            row: this.row,
            column: this.column,
            altitude: this.altitude,
            riversIn: this.riversIn,
            riversOut: this.riversOut,
            flooded: this.flooded,
            neighbours: this.neighboursWithDirection().map(([direction, neighbour]) => [direction, neighbour?.id]),
        };
    }
}
