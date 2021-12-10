import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Parser } from "../parser";
import { Literal } from "./Literal";

export class RegularExpressionLiteral extends Literal<RegExp> {
    constructor(value: string) {
        super(new RegExp(value));
    }

    static new(parser: Parser) {
        const token = parser.__eat(TokenTypes.REGULAR_EXPRESSION);
        return new RegularExpressionLiteral(token.value);
    }

    public visit(_: Interpreter) {
        return new Elx<RegExp>(this.value, "RegExp", {});
    }
}
