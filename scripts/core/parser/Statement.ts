import { Interpreter } from "../interpreter";
import { RuntimeError } from "../RuntimeError";

export class Statement {
    name?: string | undefined;

    visit(_: Interpreter): any {
        throw new RuntimeError("Not Implemented", this);
    }
}
