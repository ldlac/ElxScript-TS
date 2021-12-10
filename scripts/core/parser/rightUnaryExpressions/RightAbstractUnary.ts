import { Statement } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { RuntimeError } from "../../RuntimeError";

export class RightAbstractUnary {
    public operator: string;
    protected right: Statement;

    constructor(operator: string, right: Statement) {
        this.operator = operator;
        this.right = right;
    }

    public visit(_: Interpreter): any {
        throw new RuntimeError("Not Implemented", this);
    }

    protected rightValue(interpreter: Interpreter) {
        return this.right && this.convertToValue(interpreter.visit(this.right));
    }

    private convertToValue(expression: any) {
        if (Elx.is(expression)) {
            return (expression as Elx<any>).get();
        }

        return expression;
    }
}
