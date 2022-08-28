import { Dispatch, SetStateAction, useState } from 'react';


const useLocalStorage = <T>(key: string, initialState: T): [T, Dispatch<SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined')
            return initialState;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialState;
        } catch (error) {
            console.error(error);
            return initialState;
        }
    });

    const setValue: Dispatch<SetStateAction<T>> = value => {
        const newValue = value instanceof Function ? value(storedValue) : value;

        setStoredValue(newValue);

        if (typeof window !== 'undefined')
            window.localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
