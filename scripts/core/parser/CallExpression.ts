import { CallableFunction } from "../CallableFunction";
import { Elx } from "../Elx";
import { Interpreter } from "../interpreter";
import { RuntimeError } from "../RuntimeError";
import { Statement } from "./Statement";

export class CallExpression extends Statement {
    type: string = "CallExpression";

    callee: Statement;
    arguments: any[];
    self: boolean;

    constructor(callee: Statement, args: any[], self: boolean = false) {
        super();
        this.callee = callee;
        this.arguments = args;
        this.self = self;
    }

    public visit(interpreter: Interpreter) {
        let callee: CallableFunction | undefined = undefined;

        if (this.self) {
            const possibleCallee = interpreter.visit(this.arguments[0]);

            if (possibleCallee && Elx.is(possibleCallee)) {
                callee = possibleCallee.getCallable(this.callee.name!);
            }
        }

        if (!callee) {
            callee = interpreter.visit(this.callee) as CallableFunction;
        }

        if (!callee || !CallableFunction.is(callee)) {
            throw new RuntimeError("Can only call functions and objects", this);
        }

        const args = [];
        for (const argument of this.arguments) {
            const arg = interpreter.visit(argument);

            args.push(arg);
        }

        if (args.length != callee.arity() && callee.arity() !== Infinity) {
            throw new RuntimeError("Expected " + callee.arity() + " arguments but got " + args.length + ".", this);
        }

        return callee.call(args);
    }

    public static is(other: any): other is CallExpression {
        return other?.constructor.name === CallExpression.name;
    }
}
