import { ArgumentStatement, BlockStatement, EmptyStatement, Statement } from "..";
import { CallableFunction } from "../../CallableFunction";
import { Environment } from "../../Environment";
import { Interpreter } from "../../interpreter";
import { executeBlock } from "../statements/executeBlock";
import { AbstractBinary } from "./AbstractBinary";

export class ArrowFunctionExpression extends AbstractBinary {
    constructor(left: Statement, right: Statement) {
        super("=>", left, right);
    }

    public visit(interpreter: Interpreter): any {
        const blockStatenment = this.right as BlockStatement;
        let argumentStatement = this.left as ArgumentStatement | EmptyStatement | Statement | null;

        if (argumentStatement === null || argumentStatement instanceof EmptyStatement) {
            argumentStatement = new ArgumentStatement([]);
        } else if (argumentStatement instanceof Statement && !(argumentStatement instanceof ArgumentStatement)) {
            argumentStatement = new ArgumentStatement([argumentStatement]);
        }

        if (argumentStatement instanceof ArgumentStatement) {
            const argsStatement = argumentStatement;
            return CallableFunction.new({
                name: "",
                anonymous: false,
                arity: argsStatement.args.length,
                call(args: []) {
                    const blockEnv = new Environment(interpreter.environment);

                    argsStatement.args.forEach((arg, index) => blockEnv.add(arg.name!, args[index]));

                    return executeBlock(interpreter, blockStatenment.body, blockEnv);
                },
                toString(args: [string | undefined]) {
                    if (args) {
                        const [name] = args;
                        return `<${name}() fn>`;
                    } else {
                        return `<anonymous() fn>`;
                    }
                },
            });
        }
    }
}
