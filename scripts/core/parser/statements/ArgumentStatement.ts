import { Interpreter } from "../../interpreter";
import { Statement } from "../Statement";

export class ArgumentStatement extends Statement {
    type: string = "ArgumentStatement";

    args: Statement[];

    constructor(args: Statement[]) {
        super();
        this.args = args;
    }

    public visit(interpreter: Interpreter) {
        return this.args.map((arg) => interpreter.visit(arg));
    }
}
