export function replaceItemAtIndex<T>(arr: T[], index: number, newValue: T) {
    if (index === -1) return arr;
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeItemAtIndex<T>(arr: T[], index: number) {
    if (index === -1) return arr;
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function shuffle<T extends any[]>(array: T) {
    let temp = [...array],
        curIdx = array.length,
        rndIdx;

    while (curIdx !== 0) {
        rndIdx = Math.floor(Math.random() * curIdx);
        curIdx--;

        [temp[curIdx], temp[rndIdx]] = [temp[rndIdx], temp[curIdx]];
    }

    return temp;
}

export function randomValue<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)]
}

class QueueNode<T> {
    public value: T;
    public next: QueueNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

export class Queue<T> {
    private head: QueueNode<T> | null;
    private tail: QueueNode<T> | null;
    private length: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    };

    enqueue(value: T) {
        const node = new QueueNode(value);

        if (this.head) {
            this.tail!.next = node; // pass to old tail
            this.tail = node; // and then set new tail
        } else {
            this.head = node;
            this.tail = node;
        }

        this.length++;
    };

    dequeue() {
        if (!this.head)
            throw new Error('Queue is empty');

        const current = this.head;
        this.head = this.length > 0 ? this.head.next : null;
        this.length--;

        return current.value;
    };

    toString() {
        return this.getValues().join(', ');
    };

    isEmpty() {
        return this.length === 0;
    };

    getHead() {
        return this.head?.value;
    };

    getTail() {
        return this.tail?.value;
    };

    getValues() {
        const values = [];
        let current = this.head;

        while(current) {
            values.push(current.value);
            current = current.next;
        }

        return values;
    }

    getLength() {
        return this.length;
    };
}

export const isOutsideGrid = (width: number, height: number, from: number, to: number) => {
    if (to < 0 || to >= width * height) // top or bottom border
        return true;

    if (Math.abs(to - from) < width) { // left or right
        const curRow = Math.floor(from / width),
            nextRow = Math.floor(to / width);

        if (curRow !== nextRow)
            return true;
    }
};

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const timerToReadable = (timer: number) => {
    const date = new Date(timer * 1000);
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const minutes = date.getMinutes();

    return `${minutes}:${seconds}`;
}

export const range = (count: number) => Array.from(Array(count).keys());

export const minifyNumber = (number: number) => {
    if (number >= 1000000000000000000)
        return `${+(number / 1000000000000000000).toFixed(1)}e`

    if (number >= 1000000000000000)
        return `${+(number / 1000000000000000).toFixed(1)}p`

    if (number >= 1000000000000)
        return `${+(number / 1000000000000).toFixed(1)}t`

    if (number >= 1000000000)
        return `${+(number / 1000000000).toFixed(1)}g`;

    if (number >= 1000000)
        return `${+(number / 1000000).toFixed(1)}m`;

    if (number >= 1000)
        return `${+(number / 1000).toFixed(1)}k`;

    return number;
}
