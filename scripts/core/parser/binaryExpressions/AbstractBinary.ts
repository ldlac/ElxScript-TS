import { Statement } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { RuntimeError } from "../../RuntimeError";

export class AbstractBinary {
    public operator: string;
    protected left: Statement;
    protected right: Statement;

    constructor(operator: string, left: Statement, right: Statement) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    public visit(_: Interpreter): any {
        throw new RuntimeError("Not Implemented", this);
    }

    protected leftValue(interpreter: Interpreter) {
        return this.convertToValue(interpreter.visit(this.left));
    }

    protected rightValue(interpreter: Interpreter) {
        return this.convertToValue(interpreter.visit(this.right));
    }

    private convertToValue(expression: any) {
        if (Elx.is(expression)) {
            return (expression as Elx<any>).get();
        }

        return expression;
    }
}
