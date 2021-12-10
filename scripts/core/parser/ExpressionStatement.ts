import { Parser } from ".";
import { Interpreter } from "../interpreter";
import { Statement } from "./Statement";

export class ExpressionStatement extends Statement {
    type: string = "ExpressionStatement";

    expression: Statement;

    constructor(expression: Statement) {
        super();
        this.expression = expression;
    }

    static new(parser: Parser) {
        return new ExpressionStatement(parser.Expression());
    }

    public visit(interpreter: Interpreter) {
        return this.expression.visit(interpreter);
    }
}
