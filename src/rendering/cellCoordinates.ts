export interface HexCornerCoordinates {
    centerX: number;
    centerY: number;
    topLeft: [number, number];
    top: [number, number];
    topRight: [number, number];
    bottomRight: [number, number];
    bottom: [number, number];
    bottomLeft: [number, number];
}

export const toCoordinates = (size: number) => (cell: { row: number; column: number }): HexCornerCoordinates => {
    const aSize = size / 2;
    const bSize = (size * Math.sqrt(3)) / 2;
    const height = bSize * 2;
    const centerX = size + 3 * cell.column * aSize;
    const centerY = bSize + cell.row * height + (cell.column % 2 === 0 ? 0 : bSize);

    return {
        centerX,
        centerY,
        topLeft: [centerX - size, centerY],
        top: [centerX - aSize, centerY - bSize],
        topRight: [centerX + aSize, centerY - bSize],
        bottomRight: [centerX + size, centerY],
        bottom: [centerX + aSize, centerY + bSize],
        bottomLeft: [centerX - aSize, centerY + bSize],
    };
};

export const toFaceCoordinates = (size: number) => (cell: { row: number; column: number }): HexCornerCoordinates => {
    const aSize = size / 2;
    const bSize = (size * Math.sqrt(3)) / 2;
    const height = bSize * 2;
    const centerX = size + 3 * cell.column * aSize;
    const centerY = bSize + cell.row * height + (cell.column % 2 === 0 ? 0 : bSize);

    return {
        centerX,
        centerY,
        topLeft: [centerX - 1.5 * aSize, centerY - 0.5 * bSize],
        top: [centerX, centerY - bSize],
        topRight: [centerX + 1.5 * aSize, centerY - 0.5 * bSize],
        bottomRight: [centerX + 1.5 * aSize, centerY + 0.5 * bSize],
        bottom: [centerX, centerY + bSize],
        bottomLeft: [centerX - 1.5 * aSize, centerY + 0.5 * bSize],
    };
};

export const toPoints = (size: number) => (cell: { row: number; column: number }): number[] => {
    const { topLeft, top, topRight, bottomRight, bottom, bottomLeft } = toCoordinates(size)(cell);
    return [...topLeft, ...top, ...topRight, ...bottomRight, ...bottom, ...bottomLeft];
};
