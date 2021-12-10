import { Parser } from "..";
import { Interpreter } from "../../interpreter";
import { Statement } from "../Statement";

export class ProgramStatement implements Statement {
    body: Statement[];

    constructor(body: Statement[]) {
        this.body = body;
    }

    static new(parser: Parser) {
        return new ProgramStatement(parser.StatementList());
    }

    public visit(interpreter: Interpreter) {
        return this.body.map((statement) => interpreter.visit(statement));
    }
}
