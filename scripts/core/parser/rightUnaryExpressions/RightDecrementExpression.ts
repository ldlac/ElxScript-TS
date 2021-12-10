import { IdentifierStatement, Statement } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { RuntimeError } from "../../RuntimeError";
import { RightAbstractUnary } from "./RightAbstractUnary";

export class RightDecrementExpression extends RightAbstractUnary {
    constructor(right: Statement) {
        super("--", right);
    }

    public visit(interpreter: Interpreter): any {
        if (IdentifierStatement.is(this.right)) {
            const elx = interpreter.environment.get(this.right.name);

            if (Elx.is(elx)) {
                return --elx._value;
            }
        }

        throw new RuntimeError("Can't apply -- operator", this);
    }
}
