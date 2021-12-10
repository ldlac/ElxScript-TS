import { Environment } from "./Environment";
import { ProgramStatement, Statement } from "./parser";
import { RuntimeError } from "./RuntimeError";
import { stdlib } from "./stdlib/stdlib";

class Interpreter {
    environment: Environment;

    constructor() {
        const stdlibMap = new Map();

        stdlib.forEach((lib) => {
            if (!lib.name) {
                throw new Error("Every stdlib functions must have a name");
            }

            lib.std = true;

            stdlibMap.set(lib.name, { element: lib, const: true });
        });

        const globals = new Environment(null, stdlibMap);

        this.environment = globals;
    }

    public execute(ast: ProgramStatement): any[] {
        try {
            return this.visit(ast);
        } catch (error) {
            if (error instanceof RuntimeError) {
                throw error;
            } else {
                throw error;

                // throw new RuntimeError("Unexpected runtime error", this);
            }
        }
    }

    public visit(node: Statement | null) {
        return node?.visit(this);
    }
}

export { Interpreter };
