export interface Grid<T> {
    at: (row: number, column: number) => T | undefined;
}
