import { Interpreter } from "../../interpreter";
import { Statement } from "../Statement";

export class EmptyStatement extends Statement {
    type: string = "EmptyStatement";

    constructor() {
        super();
    }

    public visit(_: Interpreter) {
        return null;
    }
}
