import { Statement } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { RuntimeError } from "../../RuntimeError";

export class LeftAbstractUnary {
    public operator: string;
    protected left: Statement;

    constructor(operator: string, left: Statement) {
        this.operator = operator;
        this.left = left;
    }

    public visit(_: Interpreter): any {
        throw new RuntimeError("Not Implemented", this);
    }

    protected leftValue(interpreter: Interpreter) {
        return this.left && this.convertToValue(interpreter.visit(this.left));
    }

    private convertToValue(expression: any) {
        if (Elx.is(expression)) {
            return (expression as Elx<any>).get();
        }

        return expression;
    }
}
