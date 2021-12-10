import { Parser } from "..";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Statement } from "../Statement";
import { RightAbstractUnary } from "./RightAbstractUnary";
import { RightDecrementExpression } from "./RightDecrementExpression";
import { RightIncrementExpression } from "./RightIncrementExpression";
import { RightLengthExpression } from "./RightLengthExpression";

export class RightUnaryExpression extends Statement {
    operator: string;
    right: Statement;

    constructor(operator: string, right: Statement) {
        super();
        this.operator = operator;
        this.right = right;
    }

    static new(parser: Parser, operatorToken: TokenTypes): RightUnaryExpression | Statement {
        const operator = parser.__eat(operatorToken).value;

        const right = parser.CallMemberExpression();

        return new RightUnaryExpression(operator, right);
    }

    public visit(interpreter: Interpreter) {
        const unaryExpressions: [string, () => RightAbstractUnary][] = [
            ["++", () => new RightIncrementExpression(this.right)],
            ["--", () => new RightDecrementExpression(this.right)],
            ["#", () => new RightLengthExpression(this.right)],
        ];

        const match: [string, () => RightAbstractUnary] | undefined = unaryExpressions.find(
            (x) => x[0] === this.operator
        );

        if (match) {
            const [, expression] = match;

            return expression().visit(interpreter);
        }

        throw new Error(`Runtime: Unknown Unary operation ${this.operator}`);
    }
}
