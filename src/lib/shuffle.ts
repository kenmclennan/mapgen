export const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * shuffled.length);
        currentIndex -= 1;
        temporaryValue = shuffled[currentIndex];
        shuffled[currentIndex] = array[randomIndex];
        shuffled[randomIndex] = temporaryValue;
    }

    return shuffled;
};
