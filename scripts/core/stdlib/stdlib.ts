import { readFileSync, existsSync } from "fs";
import { CallableFunction } from "../CallableFunction";
import { Elx } from "../Elx";
import { RuntimeError } from "../RuntimeError";

export const stdlib = [
    CallableFunction.new({
        name: "print",
        arity: Infinity,
        call(args: any[]) {
            const res = args.map((arg) => {
                if (CallableFunction.is(arg)) {
                    return arg.toString();
                }

                return Elx.unwrap(arg);
            });

            console.log(...res);

            return args[0];
        },
        toString() {
            return `<print() native fn ...>`;
        },
    }),
    CallableFunction.new({
        name: "printr",
        arity: Infinity,
        call(args: any[]) {
            console.log(
                ...args.map((arg) => {
                    return arg.toPrintable ? arg.toPrintable() : arg.toString();
                })
            );
        },
        toString() {
            return `<printr() native fn ...>`;
        },
    }),
    CallableFunction.new({
        name: "if",
        arity: 2,
        call(args: [any, CallableFunction | any]) {
            const [condition, cb] = args;

            if (!!Elx.unwrap(condition)) {
                if (CallableFunction.is(cb)) {
                    return cb.call([]);
                } else {
                    return cb;
                }
            }
        },
        toString() {
            return `<if() native fn ...>`;
        },
    }),
    CallableFunction.new({
        name: "ifelse",
        arity: 3,
        call(args: [any, CallableFunction | any, CallableFunction | any]) {
            const [condition, cb, elsecb] = args;

            if (!!Elx.unwrap(condition)) {
                if (CallableFunction.is(cb)) {
                    return cb.call([]);
                } else {
                    return cb;
                }
            } else {
                if (CallableFunction.is(elsecb)) {
                    return elsecb.call([]);
                } else {
                    return elsecb;
                }
            }
        },
        toString() {
            return `<ifelse() native fn ...>`;
        },
    }),
    CallableFunction.new({
        name: "range",
        arity: 2,
        call(args: [Elx<number>, CallableFunction]) {
            const [it, cb] = args;

            const iterator = Elx.unwrap(it);

            if (typeof iterator !== "number") {
                throw new RuntimeError("$0 parameter must be a number", this);
            }

            if (!CallableFunction.is(cb)) {
                throw new RuntimeError("$1 parameter must be a function", this);
            }

            for (let index = 0; index < iterator; index++) {
                cb.call([index]);
            }
        },
        toString() {
            return `<range() native fn ...>`;
        },
    }),
    CallableFunction.new({
        name: "read_file_as_string",
        arity: 1,
        call(args: [string]) {
            const [file] = args;

            if (typeof file !== "string") {
                throw new RuntimeError("$0 parameter must be a string", this);
            }

            if (!existsSync(file)) {
                throw new RuntimeError("File not found", this);
            }

            return readFileSync(file).toString();
        },
        toString() {
            return `<read_file_as_string() native fn ...>`;
        },
    }),
    CallableFunction.new({
        name: "number",
        arity: 1,
        call(args: [any]) {
            const [num] = args;

            return Number(Elx.unwrap(num));
        },
        toString() {
            return `<number() native fn ...>`;
        },
    }),
];
