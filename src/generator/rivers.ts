import { v4 as uuid } from 'uuid';
import { HexCell, inverseDirection, Direction } from '../hexCell';
import { HexGrid } from '../hexGrid';
import { HexMapOptions } from '../HexMapOptions';
import { chanceIn100 } from '../lib/dice';
import { selectRandom } from '../lib/selectRandom';
import { frontier } from '../lib/frontier';
import { exists } from '../lib/exists';

const neighbourExists = (neighbour: [Direction, undefined | HexCell]): neighbour is [Direction, HexCell] =>
    neighbour[1] !== undefined;

const neighbourIsMapEdge = (neighbour: [Direction, undefined | HexCell]): neighbour is [Direction, undefined] =>
    neighbour[1] === undefined;

const lowestNeighbours = (neighbours: [Direction, HexCell | undefined][]): [Direction, HexCell][] => {
    const existingNeighbours = neighbours.filter(neighbourExists);
    const altitudes = existingNeighbours.map(([_d, n]) => n.altitude);
    const lowestAltitude = Math.min(...altitudes);
    return existingNeighbours.filter(([_d, n]) => n.altitude === lowestAltitude);
};

const mapEdgeNeighbours = (neighbours: [Direction, HexCell | undefined][]): [Direction, undefined][] => {
    return neighbours.filter(neighbourIsMapEdge);
};

const growRiver = (river: HexCell[]): void => {
    const [riverEdge, ...ancestors] = river;
    const neighbours = riverEdge.neighboursWithDirection();
    const mapEdgeCandidates = neighbours.filter(([_d, n]) => n === undefined);

    if (mapEdgeCandidates.length > 0) {
        const [direction] = selectRandom(mapEdgeCandidates);
        riverEdge.addRiverOut(direction);
        return;
    }

    const nextRiverCandidates = neighbours
        .filter(([_d, n]) => (n ? riverEdge.altitude >= n.altitude : true))
        .filter(([_d, n]) => (n ? !(ancestors.map(({ id }) => id).indexOf(n.id) >= 0) : true));

    const altitudes = nextRiverCandidates.filter(neighbourExists).map(([_d, n]) => n.altitude);
    const lowestAltitude = Math.min(...altitudes);
    const lowestAltitudeCandidates = nextRiverCandidates.filter(([_d, n]) =>
        n ? n.altitude === lowestAltitude : true,
    );

    if (lowestAltitudeCandidates.length === 0) {
        riverEdge.flood();
        // const toFlood = [...riverEdge.neighbours(), ...frontier(riverEdge.neighbours())]
        //     .filter(exists)
        //     .filter((n) => n.altitude === riverEdge.altitude)
        //     .filter((n) => river.indexOf(n) > 0);

        // toFlood.forEach((n) => n.flood());
        return;
    }

    const wetNeighbours = lowestAltitudeCandidates.filter(([_d, n]) => (n ? n.flooded : false));
    if (wetNeighbours.length > 0) {
        const [direction] = selectRandom(wetNeighbours);
        riverEdge.addRiverOut(direction);
        return;
    }

    const [direction, nextRiver] = selectRandom(lowestAltitudeCandidates);
    if (nextRiver) {
        riverEdge.addRiverOut(direction);
        nextRiver.addRiverIn(inverseDirection(direction));
        if (nextRiver.riversOut.length === 0) growRiver([nextRiver, ...river]);
    }
};

export const addRivers = (grid: HexGrid, _options: HexMapOptions): void => {
    const peaks = grid.cells().filter((cell) => cell.altitude > 7);
    peaks.forEach((peak) => {
        if (chanceIn100(30)) {
            const outlets = lowestNeighbours(peak.neighboursWithDirection()).filter(
                ([_d, n]) => peak.altitude > n.altitude,
            );

            if (outlets.length > 0) {
                const [direction, neighbour] = selectRandom(outlets);
                peak.addRiverOut(direction);
                neighbour.addRiverIn(inverseDirection(direction));
                growRiver([peak]);
            }
        }
    });
};
