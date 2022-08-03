export function replaceItemAtIndex<T>(arr: T[], index: number, newValue: T) {
    if (index === -1) return arr;
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeItemAtIndex<T>(arr: T[], index: number) {
    if (index === -1) return arr;
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function shuffle<T extends any[]>(array: T) {
    let curIdx = array.length,
        rndIdx;

    while (curIdx !== 0) {
        rndIdx = Math.floor(Math.random() * curIdx);
        curIdx--;

        [array[curIdx], array[rndIdx]] = [array[rndIdx], array[curIdx]];
    }

    return array;
}

export function randomValue<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)]
}
