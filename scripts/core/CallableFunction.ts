type CallableFunctionCreatorProps = {
    std?: boolean;
    anonymous?: boolean;
    name: string;
    call: (...args: any[]) => any;
    arity: number;
    toString: (...args: any[]) => string;
};

export interface AbstractCallable {
    std: boolean;
    anonymous: boolean;
    name: string | null;
    call(args: any[]): void;
    arity(...args: any[]): number;
    toString(...args: any[]): string;
}

export class CallableFunction implements AbstractCallable {
    std: boolean = false;
    anonymous: boolean = false;
    name: string | null = null;
    call(_: any[]): any {
        console.warn(`unimplemented function called`);
        return undefined;
    }
    arity() {
        return 0;
    }
    toString() {
        return `<unimplemented fn>`;
    }

    public static is(other: any): other is CallableFunction {
        return other?.constructor.name === CallableFunction.name;
    }

    static new(obj: CallableFunctionCreatorProps) {
        return new (class CallableFunction {
            std = obj.std ?? false;
            name = obj.name;
            anonymous = obj.anonymous ?? false;
            call(...args: any[]) {
                return obj.call(...args);
            }
            arity() {
                return obj.arity;
            }
            toString(...args: any[]) {
                return obj.toString(this.name);
            }
        })();
    }
}
