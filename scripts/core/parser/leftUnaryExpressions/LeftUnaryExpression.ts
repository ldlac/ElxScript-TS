import { Parser } from "..";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Statement } from "../Statement";
import { LeftAbstractUnary } from "./LeftAbstractUnary";
import { LeftDecrementExpression } from "./LeftDecrementExpression";
import { LeftIncrementExpression } from "./LeftIncrementExpression";

export class LeftUnaryExpression extends Statement {
    operator: string;
    left: Statement;

    constructor(operator: string, left: Statement) {
        super();
        this.operator = operator;
        this.left = left;
    }

    static new(
        parser: Parser,
        nextExpression: () => Statement,
        operatorToken: TokenTypes
    ): LeftUnaryExpression | Statement {
        let left = nextExpression();

        if (parser.__isNextToken(operatorToken)) {
            const operator = parser.__eat(operatorToken).value;

            return new LeftUnaryExpression(operator, left);
        }

        return left;
    }

    public visit(interpreter: Interpreter) {
        const unaryExpressions: [string, () => LeftAbstractUnary][] = [
            ["++", () => new LeftIncrementExpression(this.left)],
            ["--", () => new LeftDecrementExpression(this.left)],
        ];

        const match: [string, () => LeftAbstractUnary] | undefined = unaryExpressions.find(
            (x) => x[0] === this.operator
        );

        if (match) {
            const [, expression] = match;

            return expression().visit(interpreter);
        }

        throw new Error(`Runtime: Unknown Unary operation ${this.operator}`);
    }
}
