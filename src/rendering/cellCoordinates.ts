export interface FaceCoordinates {
    leftCorner: [number, number];
    middle: [number, number];
    rightCorner: [number, number];
}

export interface HexCoordinates {
    centerX: number;
    centerY: number;
    top: FaceCoordinates;
    topRight: FaceCoordinates;
    bottomRight: FaceCoordinates;
    bottom: FaceCoordinates;
    bottomLeft: FaceCoordinates;
    topLeft: FaceCoordinates;
}

export const toCoordinates = (size: number) => (cell: { row: number; column: number }): HexCoordinates => {
    const aSize = size / 2;
    const bSize = (size * Math.sqrt(3)) / 2;
    const height = bSize * 2;
    const centerX = size + 3 * cell.column * aSize;
    const centerY = bSize + cell.row * height + (cell.column % 2 === 0 ? 0 : bSize);

    return {
        centerX,
        centerY,
        top: {
            leftCorner: [centerX - aSize, centerY - bSize],
            middle: [centerX, centerY - bSize],
            rightCorner: [centerX + aSize, centerY - bSize],
        },
        topRight: {
            leftCorner: [centerX + aSize, centerY - bSize],
            middle: [centerX + 1.5 * aSize, centerY - 0.5 * bSize],
            rightCorner: [centerX + size, centerY],
        },
        bottomRight: {
            leftCorner: [centerX + size, centerY],
            middle: [centerX + 1.5 * aSize, centerY + 0.5 * bSize],
            rightCorner: [centerX + aSize, centerY + bSize],
        },
        bottom: {
            leftCorner: [centerX + aSize, centerY + bSize],
            middle: [centerX, centerY + bSize],
            rightCorner: [centerX - aSize, centerY + bSize],
        },
        bottomLeft: {
            leftCorner: [centerX - aSize, centerY + bSize],
            middle: [centerX - 1.5 * aSize, centerY + 0.5 * bSize],
            rightCorner: [centerX - size, centerY],
        },
        topLeft: {
            leftCorner: [centerX - size, centerY],
            middle: [centerX - 1.5 * aSize, centerY - 0.5 * bSize],
            rightCorner: [centerX - aSize, centerY - bSize],
        },
    };
};

export const toPoints = (size: number) => (cell: { row: number; column: number }): number[] => {
    const { topLeft, top, topRight, bottomRight, bottom, bottomLeft } = toCoordinates(size)(cell);
    return [
        ...topLeft.leftCorner,
        ...top.leftCorner,
        ...topRight.leftCorner,
        ...bottomRight.leftCorner,
        ...bottom.leftCorner,
        ...bottomLeft.leftCorner,
    ];
};
