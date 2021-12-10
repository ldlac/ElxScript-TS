import { BinaryExpression, Parser } from "..";
import { CallableFunction } from "../../CallableFunction";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Statement } from "../Statement";

export class DeclarationStatement extends Statement {
    type: string = "DeclarationStatement";

    operator: string;
    left: Statement;
    right: Statement;

    constructor(operator: string, left: Statement, right: Statement) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    static new(parser: Parser) {
        parser.__eat(TokenTypes.let);

        if (!parser.__isNextToken(TokenTypes.IDENTIFIER)) {
            throw new SyntaxError(
                `Variable name must be an identifier and cannot be a keyword, number, type or invalid symbol on line ${parser._lookahead?.value}`
            );
        }

        const initializer = parser.Expression();

        if (BinaryExpression.is(initializer)) {
            return new DeclarationStatement(initializer.operator, initializer.left, initializer.right);
        }

        throw new SyntaxError(`Variable problem ${parser._lookahead?.value}`);
    }

    public visit(interpreter: Interpreter) {
        const value = interpreter.visit(this.right);

        const left = this.left as Statement;

        switch (this.operator) {
            case "=":
                if (value && CallableFunction.is(value)) {
                    interpreter.environment.add(left.name!, value);
                } else {
                    interpreter.environment.add(left.name!, value);
                }
        }

        return null;
    }
}
