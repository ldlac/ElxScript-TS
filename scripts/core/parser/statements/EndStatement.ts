import { Parser } from "..";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Statement } from "../Statement";

export class EndStatement extends Statement {
    type: string = "EndStatement";

    constructor() {
        super();
    }

    static new(parser: Parser) {
        parser.__eat(TokenTypes.SEMI);
        return new EndStatement();
    }

    public visit(_: Interpreter) {
        return undefined;
    }

    public static is(other: any): other is EndStatement {
        return other?.constructor.name === EndStatement.name;
    }
}
