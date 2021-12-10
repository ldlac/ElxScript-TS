import { Statement } from "..";
import { CallableFunction } from "../../CallableFunction";
import { Interpreter } from "../../interpreter";
import { RuntimeError } from "../../RuntimeError";

export class PipeOperatorExpression {
    left: Statement;
    callees: Statement[];

    constructor(left: Statement, callees: Statement[]) {
        this.left = left;
        this.callees = callees;
    }

    public visit(interpreter: Interpreter): any {
        let arg = interpreter.visit(this.left);

        return this.callees
            .map((callee) => {
                callee = interpreter.visit(callee);

                if (!callee || !CallableFunction.is(callee)) {
                    throw new RuntimeError("Expected a function after |>", this);
                }

                arg = callee.call([arg]);

                return arg;
            })
            .slice(-1)[0];
    }
}
