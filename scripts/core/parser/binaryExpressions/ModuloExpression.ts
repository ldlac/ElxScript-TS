import { Statement } from "..";
import { Interpreter } from "../../interpreter";
import { AbstractBinary } from "./AbstractBinary";

export class ModuloExpression extends AbstractBinary {
    constructor(left: Statement, right: Statement) {
        super("%", left, right);
    }

    public visit(interpreter: Interpreter): any {
        const leftExpressionValue = this.leftValue(interpreter);
        const rightExpressionValue = this.rightValue(interpreter);

        return Number(leftExpressionValue) % Number(rightExpressionValue);
    }
}
