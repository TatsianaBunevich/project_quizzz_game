import { StateCreator } from 'zustand';

export type SliceWithMiddlewares<T, S = T> = StateCreator<
    T,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    S extends T ? T : S
>;
