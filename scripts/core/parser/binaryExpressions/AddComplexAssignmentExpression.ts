import { Statement } from "..";
import { Interpreter } from "../../interpreter";
import { AbstractBinary } from "./AbstractBinary";

export class AddComplexAssignmentExpression extends AbstractBinary {
    constructor(left: Statement, right: Statement) {
        super("+=", left, right);
    }

    public visit(interpreter: Interpreter): any {
        const leftExpressionValue = this.leftValue(interpreter);
        const rightExpressionValue = this.rightValue(interpreter);

        if (typeof leftExpressionValue !== typeof rightExpressionValue) {
            interpreter.environment.assign(this.left.name!, String(leftExpressionValue) + String(rightExpressionValue));
            return null;
        }

        if (leftExpressionValue != null && rightExpressionValue != null) {
            if (typeof leftExpressionValue === typeof rightExpressionValue) {
                interpreter.environment.assign(this.left.name!, (leftExpressionValue as any) + rightExpressionValue);
                return null;
            }
        }
    }
}
