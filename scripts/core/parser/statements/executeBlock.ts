import { BlockStatement, ExpressionStatement, NumericLiteral, Statement } from "..";
import { Elx } from "../../Elx";
import { Environment } from "../../Environment";
import { Interpreter } from "../../interpreter";

export function executeBlock(interpreter: Interpreter, statements: Statement[], blockEnv: Environment) {
    const previous = interpreter.environment;

    try {
        interpreter.environment = blockEnv;

        let index = 0;

        if (BlockStatement.is(statements.slice(-1)[0])) {
            index -= 2;
        } else {
            index -= 1;
        }

        const returnedStatementIndex = statements.length + index;
        let returnedStatement = undefined;

        statements.forEach((statement, index) => {
            if (index === returnedStatementIndex) {
                returnedStatement = statement.visit(interpreter);
            } else {
                statement.visit(interpreter);
            }
        });

        return returnedStatement;
    } finally {
        interpreter.environment = previous;
    }
}
