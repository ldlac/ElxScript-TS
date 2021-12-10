import { IdentifierStatement, Statement } from "..";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { RightAbstractUnary } from "./RightAbstractUnary";

export class RightLengthExpression extends RightAbstractUnary {
    constructor(right: Statement) {
        super("#", right);
    }

    public visit(interpreter: Interpreter): any {
        if (IdentifierStatement.is(this.right)) {
            const elx = interpreter.environment.get(this.right.name);

            if (Elx.is(elx)) {
                return elx.get().length;
            }
        }

        return this.rightValue(interpreter).length;
    }
}
