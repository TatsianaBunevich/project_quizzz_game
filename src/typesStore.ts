import { StateCreator } from "zustand";

export type SliceWithMiddlewares<T> = StateCreator<
    T,
    [["zustand/devtools", never]],
    [],
    T
>;
