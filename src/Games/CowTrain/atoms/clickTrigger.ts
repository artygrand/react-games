import { atom } from 'recoil';

export const clickAtom = atom<number>({
    key: 'cowTrain/clicks',
    default: 0,
});
