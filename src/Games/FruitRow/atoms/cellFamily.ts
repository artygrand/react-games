import { atomFamily } from 'recoil';


export type CellModel = {
    value: string,
    xPos: number,
    yPos: number,
    size: number,
}

export const cellFamily = atomFamily<CellModel, number>({
    key: 'fruitRow/cell',
});
