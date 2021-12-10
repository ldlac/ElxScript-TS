import { BinaryExpression, CallExpression, IdentifierStatement, Parser, Statement } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { AbstractBinary } from "./AbstractBinary";

export class DotExpression extends AbstractBinary {
    constructor(left: Statement, right: Statement) {
        super(".", left, right);
    }

    static new(parser: Parser, nextExpression: () => Statement): BinaryExpression | Statement {
        let left = nextExpression();

        while (parser.__isNextToken(TokenTypes.DOT)) {
            parser.__eat(TokenTypes.DOT);

            const right = parser.CallMemberExpression();

            if (CallExpression.is(right)) {
                right.self = true;
                right.arguments.unshift(left);

                left = right;
            } else {
                left = new DotExpression(left, right);
            }
        }

        return left;
    }

    public visit(interpreter: Interpreter): any {
        if (IdentifierStatement.is(this.left)) {
            const callee = interpreter.environment.get(this.left.name!);

            if (Elx.is<Record<string, any>>(callee)) {
                return callee.get()[this.right.name!];
            }
        } else {
            const callee = interpreter.visit(this.left);

            if (Elx.is<Record<string, any>>(callee)) {
                return callee.get()[this.right.name!];
            }
        }
    }

    public static is(other: any): other is DotExpression {
        return other?.constructor.name === DotExpression.name;
    }
}
