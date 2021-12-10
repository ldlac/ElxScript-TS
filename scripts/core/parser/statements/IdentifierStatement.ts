import { Parser } from "..";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Statement } from "../Statement";

export class IdentifierStatement extends Statement {
    type: string = "IdentifierStatement";

    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    static new(parser: Parser) {
        const token = parser.__eat(TokenTypes.IDENTIFIER);
        return new IdentifierStatement(token.value);
    }

    public visit(interpreter: Interpreter) {
        return interpreter.environment.get(this.name);
    }

    public static is(other: any): other is IdentifierStatement {
        return other?.constructor.name === IdentifierStatement.name;
    }
}
