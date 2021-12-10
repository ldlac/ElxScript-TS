import { Parser } from "..";
import { CallableFunction } from "../../CallableFunction";
import { Callables, Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { RuntimeError } from "../../RuntimeError";
import { Literal } from "./Literal";

const stringCallables: Callables = {
    add: CallableFunction.new({
        name: "add",
        arity: 1,
        call: (args: [Elx<String>]) => args[0].get() + "_self",
        toString: () => `<add() native fn ...>`,
    }),
    split: CallableFunction.new({
        name: "split",
        arity: 2,
        call(args: [Elx<String>, string | RegExp]) {
            const [elx, splitter] = args;

            if (elx.get().constructor.name === String.name) {
                throw new RuntimeError("$0 parameter must be an string", this);
            }

            if (splitter.constructor.name !== String.name && splitter.constructor.name !== RegExp.name) {
                throw new RuntimeError("$1 parameter must be an string or regular expression", this);
            }

            return elx.get().split(splitter);
        },
        toString() {
            return `<range() native fn ...>`;
        },
    }),
};

export class StringLiteral extends Literal<string> {
    constructor(value: string) {
        super(value);
    }

    static new(parser: Parser) {
        const token = parser.__eat(TokenTypes.STRING);
        return new StringLiteral(token.value.slice(1, -1));
    }

    public visit(_: Interpreter) {
        return new Elx<String>(this.value, "String", stringCallables);
    }
}
