import { v4 as uuid } from 'uuid';
import { HexCell, DIRECTIONS, Direction } from '../hexCell';
import { HexGrid } from '../hexGrid';
import { HexMapOptions } from '../HexMapOptions';
import { chanceIn100 } from '../lib/dice';
import { exists } from '../lib/exists';
import { any } from '../lib/any';
import { selectRandom } from '../lib/selectRandom';

const cellIsUndefined = (cell: undefined | HexCell): cell is undefined => cell === undefined;

const isEdgeCell = (cell: HexCell): boolean => any(cell.neighboursList().filter(cellIsUndefined));

const lowestNeighbours = (neighbours: (HexCell | undefined)[]): HexCell[] => {
    const existingNeighbours = neighbours.filter(exists);
    const altitudes = existingNeighbours.map((n) => n.altitude);
    const lowestAltitude = Math.min(...altitudes);
    return existingNeighbours.filter((n) => n.altitude === lowestAltitude);
};

const isLowerThan = (source: HexCell) => (cell: HexCell): boolean => source.altitude >= cell.altitude;

export class River {
    public id: string;

    public course: HexCell[];

    public exitDirection: Direction | undefined;

    constructor(course: HexCell[] = []) {
        this.id = uuid();
        this.course = course;
    }

    public first(): HexCell | undefined {
        return this.course[0];
    }

    public last(): HexCell | undefined {
        return this.course[this.course.length - 1];
    }

    public isAncestor(cell: HexCell): boolean {
        return this.course.indexOf(cell) >= 0;
    }

    public isNotAncestor(cell: HexCell): boolean {
        return this.course.indexOf(cell) < 0;
    }

    public exitsMap(): boolean {
        return this.exitDirection !== undefined;
    }

    public grow(): void {
        const source = this.last();
        if (!source) return;

        const outlet = selectRandom(
            lowestNeighbours(source.neighboursList())
                .filter((n) => this.isNotAncestor(n))
                .filter(isLowerThan(source)),
        );

        if (isEdgeCell(source)) {
            const directions = DIRECTIONS.map((d) => (source.neighbourInDirection(d) ? undefined : d)).filter(exists);
            this.exitDirection = selectRandom(directions);
            return;
        }

        if (!outlet) {
            source.flood();
            return;
        }

        if (outlet.hasRiver()) {
            this.course.push(outlet);
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public toJson() {
        return {
            id: this.id,
            course: this.course.map(({ id }) => id),
            exitDirection: this.exitDirection,
        };
    }
}

export const addRivers = (grid: HexGrid, options: HexMapOptions): River[] => {
    const rivers = River.findSources(grid, options);
    rivers.forEach((river) => river.grow());
    return rivers;
};
