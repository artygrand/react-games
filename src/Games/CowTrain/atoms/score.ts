import { atom } from 'recoil';

export const scoreAtom = atom<number>({
    key: 'cowTrain/score',
    default: 0,
    effects: [
        ({ onSet }) => {
            onSet(newValue => localStorage.setItem('cowTrain/score', JSON.stringify(newValue)));
        },
    ],
});
