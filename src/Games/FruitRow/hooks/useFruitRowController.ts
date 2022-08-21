import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { cellFamily } from 'Games/FruitRow/atoms/cellFamily';
import { scoreAtom } from 'Games/FruitRow/atoms/score';
import { isOutsideGrid, randomValue, sleep } from 'utils/common';


export type Settings = {
    cols: number,
    rows: number,
}

type Direction = 't' | 'b' | 'r' | 'l';

type IdByDir = { [key in Direction]: (k: number) => number }

const emojis = ['🍇', '🍉', '🍒', '🍌', '🍑', '🍈'];

const reverseDirection: { [key in Direction]: Direction } = {
    t: 'b',
    r: 'l',
    b: 't',
    l: 'r',
};

const useFruitRowController = (settings: Settings) => {
    const [ cells, setCells ] = useState<number[]>([]);
    const fieldRef = useRef<HTMLDivElement>(null);
    const setScore = useSetRecoilState(scoreAtom);

    const nextIdByDirection: IdByDir = {
        t: pos => pos - settings.cols,
        r: pos => pos + 1,
        b: pos => pos + settings.cols,
        l: pos => pos - 1,
    };

    const createCell = useRecoilCallback(({ set }) => (x: number, y: number) => {
        const id = x + settings.cols * y;

        set(cellFamily(id), {
            value: randomValue(emojis),
            xPos: x * 100 / settings.cols,
            yPos: y * 100 / settings.rows,
            size: 100 / settings.cols,
        });
    }, []);

    const swapCells = useRecoilCallback(({ set, snapshot }) => (a: number, b: number) => {
        const aCell = snapshot.getLoadable(cellFamily(a)).contents;
        const bCell = snapshot.getLoadable(cellFamily(b)).contents;

        set(cellFamily(a), old => ({
            ...old,
            value: bCell.value,
        }));

        set(cellFamily(b), old => ({
            ...old,
            value: aCell.value,
        }));
    }, []);

    const getLargestRow = useRecoilCallback(({ snapshot }) => (startId: number) => {
        // Again magic values.
        // Key is vertical (top -> bottom) or horizontal (right -> left) line
        const rows: {[key: string]: number[]} = {
            tb: [startId],
            rl: [startId],
        };

        const value = snapshot.getLoadable(cellFamily(startId)).contents.value;

        Object.keys(rows).forEach(key => {
            for (const dir of key) {
                let cur = startId;

                while (true) {
                    // go to selected direction
                    let nextId = nextIdByDirection[dir as Direction](cur);

                    if (isOutsideGrid(settings.cols, settings.rows, cur, nextId))
                        break;

                    let nextCell = snapshot.getLoadable(cellFamily(nextId)).contents;

                    if (nextCell.value === value) {
                        rows[key].push(nextId);
                        cur = nextId;
                    } else {
                        break;
                    }
                }
            }
        });

        if (rows.tb.length < 3 && rows.rl.length < 3)
            return [];

        return rows.tb.length > rows.rl.length ? rows.tb : rows.rl;
    }, []);

    const getPossibleRowAfterSwap = useCallback((a: number, b: number) => {
        const aRow = getLargestRow(a);
        const bRow = getLargestRow(b);

        if (aRow.length < 3 && bRow.length < 3)
            return [];

        return aRow.length > bRow.length ? aRow : bRow;
    }, [getLargestRow]);

    const restructureCells = useRecoilCallback(({ set, snapshot }) => (row: number[]) => {
        row.sort((a, b) => a - b); // fuck you stupid js

        const fallColumn = (bottom: number, top: number) => {
            const fallen = [];

            while (bottom > -1) { // from bottommost deleted to top of field
                const sourceId = nextIdByDirection['t'](top); // go higher

                if (sourceId < 0) { // outside field
                    // generate new cell
                    set(cellFamily(bottom), old => ({
                        ...old,
                        value: randomValue(emojis),
                    }));
                } else {
                    // take from the top
                    const source = snapshot.getLoadable(cellFamily(sourceId)).contents;
                    set(cellFamily(bottom), old => ({
                        ...old,
                        value: source.value,
                    }));
                    fallen.push(sourceId);
                }

                bottom = nextIdByDirection['t'](bottom);
                top = sourceId;
            }

            return fallen;
        };

        const fallen: number[] = [...row];
        let possibleDeletable: number[] = [...row];
        let height = 1;

        if (row[1] - row[0] === 1) { // horizontal
            const firstColumn = row[0],
                lastColumn = row[row.length - 1];

            row.forEach(id => {
                const fall = fallColumn(id, id);

                fallen.push(...fall);

                if (id === firstColumn || id === lastColumn)
                    possibleDeletable.push(...fall)
            });
        } else { // vertical
            fallen.push(...fallColumn(row[row.length - 1], row[0]));
            possibleDeletable = fallen;
            height = row.length;
        }

        return { fallen, possibleDeletable, height };
    }, []);

    // On start fill field with fruits
    useEffect(() => {
        for (let x = 0; x < settings.cols; x++) {
            for (let y = 0; y < settings.rows; y++) {
                createCell(x, y);
            }
        }

        setCells(Array.from(Array(settings.cols * settings.rows).keys()))
    }, [createCell, settings.cols, settings.rows]);

    // Add drag and drop
    useEffect(() => {
        fieldRef.current!.onpointerdown = (e) => {
            if (e.target === e.currentTarget)
                return false; // Should work only with children cells

            const currentCell = e.target as HTMLDivElement;
            const currentId = +currentCell.id;

            let neighbourCell: HTMLElement | null;

            const startX = e.clientX,
                startY = e.clientY;

            const revertCurrent = () => {
                currentCell.className = 'anim';
            };

            const revertNeighbour = () => {
                if (!neighbourCell) return;
                neighbourCell.className = 'anim';
                neighbourCell = null;
            };

            const move = (e: MouseEvent) => {
                const distX = e.clientX - startX;
                const distY = e.clientY - startY;

                // mouse should move at least 15 pixels from start to try swap
                if (distY * distY + distX * distX < 225) {
                    revertCurrent();
                    revertNeighbour();
                    return;
                }

                let dir: Direction;
                if (Math.abs(distY) > Math.abs(distX))
                    dir = e.clientY > startY ? 'b' : 't';
                else
                    dir = e.clientX > startX ? 'r' : 'l';

                const bId = nextIdByDirection[dir](currentId);

                if (isOutsideGrid(settings.cols, settings.rows, currentId, bId))
                    return;

                currentCell.className = `anim ${dir}-1`;

                const cell = document.getElementById(bId.toString())!;

                // if new neighbour
                if (cell !== neighbourCell) {
                    revertNeighbour();

                    neighbourCell = cell; // use it
                    neighbourCell.className = `anim ${reverseDirection[dir]}-1`;
                }
            };

            document.addEventListener('pointermove', move);

            document.onpointerup = async () => {
                document.removeEventListener('pointermove', move);
                document.onpointerup = null;

                if (!neighbourCell) return;

                const neighbourId = +neighbourCell.id;
                swapCells(currentId, neighbourId);
                let changed = getPossibleRowAfterSwap(currentId, neighbourId);

                if (changed.length) {
                    // instant change positions
                    currentCell.className = '';
                    neighbourCell.className = '';

                    // clear neighbour
                    neighbourCell = null;

                    await sleep(100);

                    // and start cycle
                    let iteration = 1;
                    while (changed.length) {
                        // chained reaction gives more score
                        setScore(old => old + changed.length * iteration++);
                        changed = await cycleDeleteFallCheck(changed);
                    }
                } else {
                    swapCells(currentId, neighbourId);
                    revertCurrent();
                    revertNeighbour();
                }
            };
        };

        return () => {
            // eslint-disable-next-line
            fieldRef.current && (fieldRef.current.onpointerdown = null);
        }
        // eslint-disable-next-line
    }, []);

    const cycleDeleteFallCheck = async (row: number[]) => {
        const affected: HTMLElement[] = [];

        // Start remove from field
        row.forEach(id => {
            const el = document.getElementById(id.toString())!;
            el.className = 'shrink';
            affected.push(el);
        });

        // Let the animation end
        await sleep(250);

        // Clear animation
        affected.forEach(el => {
            el.className = '';
        });

        const { fallen, possibleDeletable, height } = restructureCells(row);

        affected.length = 0;

        // They will fall, so put it higher by style
        fallen.forEach(id => {
            const el = document.getElementById(id.toString())!;
            // instant change position
            el.className = `t-${height}`;
            affected.push(el)
        });

        // Wait 2 render frames
        await sleep(1000 / 60 * 2);

        // Add fall animation only after position changed
        affected.forEach(el => {
             el.className = `fall-${height}`
        });

        // Wait for fall animation
        await sleep(150 + 50 * height);

        let largestRowToDelete: number[] = [];

        possibleDeletable.forEach(id => {
            const row = getLargestRow(id);
            if (row.length > largestRowToDelete.length)
                largestRowToDelete = row;
        });

        return largestRowToDelete;
    };

    return {
        cells,
        fieldRef,
    };
};

export default useFruitRowController;
