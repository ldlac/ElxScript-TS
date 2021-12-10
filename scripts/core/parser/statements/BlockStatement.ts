import { Parser } from "..";
import { Environment } from "../../Environment";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Statement } from "../Statement";
import { executeBlock } from "./executeBlock";

export class BlockStatement extends Statement {
    type: string = "BlockStatement";

    body: Statement[];

    constructor(body: Statement[]) {
        super();
        this.body = body;
    }

    static new(parser: Parser) {
        if (parser.__isNextToken(TokenTypes.CURLY_START)) {
            parser.__eat(TokenTypes.CURLY_START);

            const body = !parser.__isNextToken(TokenTypes.CURLY_END) ? parser.StatementList(TokenTypes.CURLY_END) : [];

            parser.__eat(TokenTypes.CURLY_END);

            return new BlockStatement(body);
        } else {
            const body = [parser.Statement()];

            return new BlockStatement(body);
        }
    }

    public visit(interpreter: Interpreter) {
        return executeBlock(interpreter, this.body, new Environment(interpreter.environment));
    }

    public static is(other: any): other is BlockStatement {
        return other?.constructor.name === BlockStatement.name;
    }
}
