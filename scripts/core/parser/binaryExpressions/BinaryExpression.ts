import { Parser } from "..";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { Statement } from "../Statement";
import { AbstractBinary } from "./AbstractBinary";
import { AddComplexAssignmentExpression } from "./AddComplexAssignmentExpression";
import { ArrowFunctionExpression } from "./ArrowFunctionExpression";
import { DivisionSignExpression } from "./DivisionSignExpression";
import { EqualityExpression } from "./EqualityExpression";
import { GreaterOrEqualExpression } from "./GreaterOrEqualExpression";
import { LessOrEqualExpression } from "./LessOrEqualExpression";
import { LogicalAndExpression } from "./LogicalAndExpression";
import { LogicalOrExpression } from "./LogicalOrExpression";
import { MinusSignExpression } from "./MinusSignExpression";
import { ModuloExpression } from "./ModuloExpression";
import { NotEqualityExpression } from "./NotEqualityExpression";
import { PipeOperatorExpression } from "./PipeOperatorExpression";
import { PlusSignExpression } from "./PlusSignExpression";
import { AssignmentExpression } from "./AssignmentExpression";
import { StrictGreaterEqualExpression } from "./StrictGreaterEqualExpression";
import { StrictLessEqualExpression } from "./StrictLessEqualExpression";
import { SubstractComplexAssignmentExpression } from "./SubstractComplexAssignmentExpression";
import { TimesSignExpression } from "./TimesSignExpression";

export class BinaryExpression extends Statement {
    operator: string;
    left: Statement;
    right: Statement;

    constructor(operator: string, left: Statement, right: Statement) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    static new(
        parser: Parser,
        nextExpression: () => Statement,
        operatorToken: TokenTypes,
        rightExpression: () => Statement
    ): BinaryExpression | Statement {
        let left = nextExpression();

        while (parser.__isNextToken(operatorToken)) {
            const operator = parser.__eat(operatorToken).value;

            const right = rightExpression();

            left = new BinaryExpression(operator, left, right);
        }

        return left;
    }

    public visit(interpreter: Interpreter) {
        const binaryExpressions: [string, () => AbstractBinary][] = [
            ["=", () => new AssignmentExpression(this.left, this.right)],
            ["+=", () => new AddComplexAssignmentExpression(this.left, this.right)],
            ["-=", () => new SubstractComplexAssignmentExpression(this.left, this.right)],
            ["==", () => new EqualityExpression(this.left, this.right)],
            ["!=", () => new NotEqualityExpression(this.left, this.right)],
            ["<=", () => new LessOrEqualExpression(this.left, this.right)],
            ["<", () => new StrictLessEqualExpression(this.left, this.right)],
            [">=", () => new GreaterOrEqualExpression(this.left, this.right)],
            [">", () => new StrictGreaterEqualExpression(this.left, this.right)],
            ["%", () => new ModuloExpression(this.left, this.right)],
            ["&&", () => new LogicalAndExpression(this.left, this.right)],
            ["||", () => new LogicalOrExpression(this.left, this.right)],
            ["+", () => new PlusSignExpression(this.left, this.right)],
            ["*", () => new TimesSignExpression(this.left, this.right)],
            ["-", () => new MinusSignExpression(this.left, this.right)],
            ["/", () => new DivisionSignExpression(this.left, this.right)],
            ["=>", () => new ArrowFunctionExpression(this.left, this.right)],
        ];

        const match: [string, () => AbstractBinary] | undefined = binaryExpressions.find((x) => x[0] === this.operator);

        if (match) {
            const [, expression] = match;

            return expression().visit(interpreter);
        }

        throw new Error(`Runtime: Unknown Binary operation ${this.operator}`);
    }

    public static is(other: any): other is BinaryExpression {
        return other?.constructor.name === BinaryExpression.name;
    }
}
