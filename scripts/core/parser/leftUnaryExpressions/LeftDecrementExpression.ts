import { IdentifierStatement, Statement } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { RuntimeError } from "../../RuntimeError";
import { LeftAbstractUnary } from "./LeftAbstractUnary";

export class LeftDecrementExpression extends LeftAbstractUnary {
    constructor(left: Statement) {
        super("--", left);
    }

    public visit(interpreter: Interpreter): any {
        if (IdentifierStatement.is(this.left)) {
            const elx = interpreter.environment.get(this.left.name);

            if (Elx.is(elx)) {
                return elx._value--;
            }
        }

        throw new RuntimeError("Can't apply -- operator", this);
    }
}
