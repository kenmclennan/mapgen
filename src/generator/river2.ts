import { v4 as uuid } from 'uuid';
import { HexCell } from '../hexCell';
import { HexGrid } from '../hexGrid';
import { HexMapOptions } from '../HexMapOptions';
import { chanceIn100 } from '../lib/dice';
import { exists } from '../lib/exists';
import { any } from '../lib/any';
import { selectRandom } from '../lib/selectRandom';

const cellIsUndefined = (neighbour: undefined | HexCell): neighbour is undefined => neighbour === undefined;

const isEdgeCell = (cell: HexCell): boolean => any(cell.neighbours().filter(cellIsUndefined));

const lowestNeighbours = (neighbours: (HexCell | undefined)[]): HexCell[] => {
    const existingNeighbours = neighbours.filter(exists);
    const altitudes = existingNeighbours.map((n) => n.altitude);
    const lowestAltitude = Math.min(...altitudes);
    return existingNeighbours.filter((n) => n.altitude === lowestAltitude);
};

const isLowerThan = (source: HexCell) => (cell: HexCell): boolean => source.altitude >= cell.altitude;

// const mapEdgeNeighbours = (neighbours: (HexCell | undefined)[]): [Direction, undefined][] => {
//     return neighbours.filter(neighbourIsMapEdge);
// };

// start at peaks
// seek lowest next cell that isn't an ancestor
//     pick an initial direction that is either a map edge or a lowest neighbour
//     if there is a map edge, go off map, STOP
//     if there is no path, flood cell, STOP
//     if selected cell is part of another River, join and stop
// continue

export class River {
    public id: string;

    public course: HexCell[];

    constructor(course: HexCell[] = []) {
        this.id = uuid();
        this.course = course;
    }

    public isAncestor(cell: HexCell): boolean {
        return this.course.indexOf(cell) >= 0;
    }

    public isNotAncestor(cell: HexCell): boolean {
        return this.course.indexOf(cell) < 0;
    }

    public grow(): void {
        const source = this.course[-1];
        const outlet = selectRandom(
            lowestNeighbours(source.neighbours())
                .filter((n) => this.isNotAncestor(n))
                .filter(isLowerThan(source)),
        );

        if (isEdgeCell(source)) {
            // Todo - find an exit direction
            return;
        }

        if (!outlet) {
            source.flood();
            return;
        }

        if (outlet.hasRiver()) {
            outlet.addRiver(this);
            return;
        }

        outlet.addRiver(this);
        this.course.push(outlet);

        this.grow();
    }

    static findSources(grid: HexGrid, options: HexMapOptions): River[] {
        const { riverChancePerPeak, riverSourceAltitude } = options;
        return grid
            .cells()
            .filter((cell) => cell.altitude >= riverSourceAltitude)
            .filter(() => chanceIn100(riverChancePerPeak))
            .map(River.fromSource);
    }

    static fromSource(source: HexCell): River {
        const river = new River([source]);
        source.addRiver(river);
        return river;
    }
}
