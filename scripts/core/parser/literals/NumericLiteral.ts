import { Parser } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Literal } from "./Literal";

export class NumericLiteral extends Literal<number> {
    constructor(value: number) {
        super(value);
    }

    static new(parser: Parser) {
        const token = parser.__eat(TokenTypes.NUMBER);
        return new NumericLiteral(Number(token.value));
    }

    public visit(_: Interpreter) {
        return new Elx<Number>(this.value, "Number", {});
    }
}
