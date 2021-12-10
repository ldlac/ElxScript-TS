import { DotExpression, IdentifierStatement, Statement } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { RuntimeError } from "../../RuntimeError";
import { AbstractBinary } from "./AbstractBinary";

export class AssignmentExpression extends AbstractBinary {
    constructor(left: Statement, right: Statement) {
        super("=", left, right);
    }

    public visit(interpreter: Interpreter): any {
        const rightExpressionValue = this.rightValue(interpreter);

        if (IdentifierStatement.is(this.left)) {
            interpreter.environment.assign(this.left.name, rightExpressionValue);
            return null;
        }

        if (DotExpression.is(this.left)) {
            const callee = interpreter.visit(this.left);

            if (Elx.is(callee)) {
                callee.set(rightExpressionValue);
            }
        }

        throw new RuntimeError("AssignmentExpression", this);
    }
}
