import { HexCell } from '../hexCell';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const visitStateTracker = (cells: HexCell[]) => {
    const visitStateTable = cells.reduce((list, c) => {
        // eslint-disable-next-line no-param-reassign
        list[c.id] = false;
        return list;
    }, {});

    const hasBeenVisited = (cell: HexCell): boolean => visitStateTable[cell.id];
    const hasNotBeenVisited = (cell: HexCell): boolean => !visitStateTable[cell.id];

    const markVisited = (cell: HexCell): void => {
        visitStateTable[cell.id] = true;
    };

    return {
        hasBeenVisited,
        hasNotBeenVisited,
        markVisited,
        visitStateTable,
    };
};
