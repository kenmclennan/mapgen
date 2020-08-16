export const coinFlip = (): boolean => [true, false][Math.floor(Math.random() * 2)];

export const D = (die: number): number => Math.ceil(Math.random() * die);

export const chanceIn = (range: number) => (threshold: number): boolean => D(range) <= threshold;

export const chanceIn6 = chanceIn(6);

export const chanceIn100 = chanceIn(100);
