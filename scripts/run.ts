import { Elx } from "./core/Elx";
import { Interpreter } from "./core/interpreter";
import { Parser } from "./core/parser/parser";

export function run(fileName: string, source: string) {
    const lastInstruction = internalRun(source);

    console.log(lastInstruction);

    return Number(!lastInstruction);
}

export function internalRun(source: string) {
    console.time("Parsing time");

    const ast = new Parser(source).parse();

    console.timeEnd("Parsing time");

    console.time("Execution time");

    const result = new Interpreter().execute(ast);

    console.timeEnd("Execution time");

    const lastInstruction = Elx.unwrap(result.slice(-1)[0]);

    return lastInstruction;
}
