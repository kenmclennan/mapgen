export const exists = <T>(maybe: T | null | undefined): maybe is T => maybe !== null && maybe !== undefined;
