export const pad = (char: string) => (length: number) => (text: string | number): string => {
    let padded = String(text);
    while (padded.length < length) {
        padded = `${char}${padded}`;
    }
    return padded;
};

export const padZero = pad('0');
