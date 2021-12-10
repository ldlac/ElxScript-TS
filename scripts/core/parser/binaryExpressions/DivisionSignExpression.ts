import { Statement } from "..";
import { Interpreter } from "../../interpreter";
import { AbstractBinary } from "./AbstractBinary";

export class DivisionSignExpression extends AbstractBinary {
    constructor(left: Statement, right: Statement) {
        super("/", left, right);
    }

    public visit(interpreter: Interpreter): any {
        const leftExpressionValue = this.leftValue(interpreter);
        const rightExpressionValue = this.rightValue(interpreter);

        if (typeof leftExpressionValue !== typeof rightExpressionValue) {
            return Number(leftExpressionValue) / Number(rightExpressionValue);
        }

        if (leftExpressionValue != null && rightExpressionValue != null) {
            if (typeof leftExpressionValue === typeof rightExpressionValue) {
                return (leftExpressionValue as any) / (rightExpressionValue as any);
            }
        }
    }
}
