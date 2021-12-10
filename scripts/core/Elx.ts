import { CallableFunction } from "./CallableFunction";
import { Statement } from "./parser";
import { RuntimeError } from "./RuntimeError";

export interface Callables {
    [name: string]: CallableFunction;
}

interface _Elx {
    __value__: any;
    __is_mutable__: boolean;
    __callables__: Callables;
}

const elxCallables = {
    to_repr: CallableFunction.new({
        name: "to_repr",
        arity: 1,
        call: (args: [Elx<any>]) => {
            const [elx] = args;
            return elx.toRepr();
        },
        toString: () => `<to_repr() native fn ...>`,
    }),
    set: CallableFunction.new({
        name: "set",
        arity: 2,
        call: (args: [Elx<any>, any]) => {
            const [elx, arg] = args;
            return elx.set(arg);
        },
        toString: () => `<set() native fn ...>`,
    }),
    get: CallableFunction.new({
        name: "get",
        arity: 1,
        call: (args: [Elx<any>]) => {
            const [elx] = args;
            return elx.get();
        },
        toString: () => `<get() native fn ...>`,
    }),
};

export type ElxPrimitiveType = "Object" | "Array" | "String" | "Number" | "Boolean" | "RegExp";

export class Elx<T> {
    public type: ElxPrimitiveType;
    public _value: T;
    public isMutable;

    private stdCallables = {};
    private elxCallables = elxCallables;
    private selfCallables = {};

    public get callables(): Callables {
        return { ...this.selfCallables, ...this.elxCallables, ...this.stdCallables };
    }

    constructor(
        value: any,
        type: ElxPrimitiveType,
        stdCallables: Callables = {},
        selfCallables: Callables = {},
        isMutable: boolean = false
    ) {
        this._value = value;
        this.type = type;
        this.isMutable = isMutable;
        this.stdCallables = stdCallables;
        this.selfCallables = selfCallables;
    }

    public toRepr() {
        return (this._value as any).toString();
    }

    public set(new_value: any) {
        if (this.isMutable) {
            this._value = new_value;
        } else {
            throw new RuntimeError("Cannot change value, Elx is immutable", this);
        }
    }

    public mset(new_value: any) {
        this._value = new_value;
    }

    public get() {
        return this._value;
    }

    public getCallable(name: string) {
        return this.callables[name];
    }

    public toPrintable(): _Elx {
        return {
            __value__: this._value,
            __is_mutable__: this.isMutable,
            __callables__: this.callables,
        };
    }

    public static is<T = any>(other: any): other is Elx<T> {
        return other?.constructor.name === Elx.name;
    }

    public static unwrap(t: any): any {
        if (t instanceof Array) {
            return t.map((v) => Elx.unwrap(v));
        }

        if (t?.type === "Array" && Elx.is<Array<any>>(t)) {
            return t.get().map((v) => Elx.unwrap(v));
        }

        if (t?.type === "Object" && Elx.is<Record<string, Statement>>(t)) {
            return Object.keys(t.get()).reduce((a: Record<string, any>, x) => {
                return { ...a, [x]: Elx.unwrap(t.get()[x]) };
            }, {});
        }

        if (Elx.is(t)) {
            return t.get();
        }

        return t;
    }
}
