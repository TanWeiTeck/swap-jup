import { atom } from 'jotai';
import { debounce } from 'lodash';

export const fromCurrencyAtom = atom('');
export const toCurrencyAtom = atom('');
export const fromAmountAtom = atom<string>('');
export const toAmountAtom = atom<string>('');
export const lastChangedAtom = atom<'from' | 'to'>('from');

const debouncedAmountAtomBase = atom<string>('');
let debouncedSetter: ((value: string) => void) | null = null;

export const debouncedAmountAtom = atom(
  (get) => get(debouncedAmountAtomBase),
  (get, set, value: string) => {
    if (!debouncedSetter) {
      debouncedSetter = debounce((val: string) => {
        set(debouncedAmountAtomBase, val);
      }, 500);
    }
    debouncedSetter(value);
  }
);
