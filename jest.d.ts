declare namespace jest {
    interface Each {
        // Exclusively arrays.
        <T extends any[]>(cases: ReadonlyArray<T>): (name: string, fn: (...args: T) => any, timeout?: number) => void;
        // Not arrays.
        <T>(cases: ReadonlyArray<T>): (name: string, fn: (...args: T[]) => any, timeout?: number) => void;
        (cases: ReadonlyArray<ReadonlyArray<any>>): (
            name: string,
            fn: (...args: any[]) => any,
            timeout?: number
        ) => void;
        (strings: TemplateStringsArray, ...placeholders: any[]): (
            name: string,
            fn: (arg: any) => any,
            timeout?: number
        ) => void;
    }

    interface Describe {
        each: Each;
    }
}
