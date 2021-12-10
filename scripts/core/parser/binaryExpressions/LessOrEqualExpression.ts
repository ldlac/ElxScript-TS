import { Statement } from "..";
import { Interpreter } from "../../interpreter";
import { AbstractBinary } from "./AbstractBinary";

export class LessOrEqualExpression extends AbstractBinary {
    constructor(left: Statement, right: Statement) {
        super("<=", left, right);
    }

    public visit(interpreter: Interpreter): any {
        const leftExpressionValue = this.leftValue(interpreter);
        const rightExpressionValue = this.rightValue(interpreter);

        if (leftExpressionValue == null || rightExpressionValue == null) {
            return false;
        }

        return leftExpressionValue <= rightExpressionValue;
    }
}
