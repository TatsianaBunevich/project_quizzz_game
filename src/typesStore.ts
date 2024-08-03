import { StateCreator } from "zustand";

export type SliceWithMiddlewares<T> = StateCreator<
    T,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    T
>;
