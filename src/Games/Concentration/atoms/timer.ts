import { atom } from 'recoil';

export const timerAtom = atom({
    key: 'concentration/timer',
    default: 0,
});
