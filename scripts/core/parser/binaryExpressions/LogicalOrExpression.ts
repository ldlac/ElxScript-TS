import { Statement } from "..";
import { Interpreter } from "../../interpreter";
import { AbstractBinary } from "./AbstractBinary";

export class LogicalOrExpression extends AbstractBinary {
    constructor(left: Statement, right: Statement) {
        super("||", left, right);
    }

    public visit(interpreter: Interpreter): any {
        const leftExpressionValue = this.leftValue(interpreter);

        if (leftExpressionValue || leftExpressionValue === "") {
            const rightExpressionValue = this.rightValue(interpreter);

            return leftExpressionValue || rightExpressionValue;
        } else {
            return leftExpressionValue;
        }
    }
}
