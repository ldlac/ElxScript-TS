import { Parser } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Literal } from "./Literal";

export class BooleanLiteral extends Literal<boolean> {
    constructor(value: boolean) {
        super(value);
    }

    static new(parser: Parser, tokenType: TokenTypes) {
        const token = parser.__eat(tokenType);
        if (token.value === "true") {
            return new BooleanLiteral(true);
        } else {
            return new BooleanLiteral(false);
        }
    }

    public visit(_: Interpreter) {
        return new Elx<Boolean>(this.value, "Boolean", {});
    }
}
