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
