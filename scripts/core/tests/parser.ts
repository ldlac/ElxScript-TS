import {
    ArrayLiteral,
    BooleanLiteral,
    ExpressionStatement,
    NumericLiteral,
    Parser,
    ProgramStatement,
    StringLiteral,
    RegularExpressionLiteral,
    DeclarationStatement,
    EndStatement,
    ObjectLiteral,
} from "../parser";
import { RangeArrayLiteral } from "../parser/literals/ArrayLiteral";

describe("Parse empty program", () => {
    describe("single empty program", () => {
        it("should be program statement", () => {
            const parser = new Parser("");
            const ast = parser.parse();

            expect(ast).toBeInstanceOf(ProgramStatement);
        });
    });
});

describe("Parse literals", () => {
    describe.each([
        [NumericLiteral, "667"],
        [StringLiteral, `"hello"`],
        [StringLiteral, `"   hello    "`],
        [
            StringLiteral,
            `
            // comment "hello"
            "hello"`,
        ],
        [
            StringLiteral,
            `
            // comment
            "hello"`,
        ],
        [
            StringLiteral,
            `
            /* 
            * two lines comment
            */

            "hello"`,
        ],
        [BooleanLiteral, "true"],
        [BooleanLiteral, "false"],
        [ArrayLiteral, "[]"],
        [ArrayLiteral, "[1]"],
        [ArrayLiteral, "[1,2]"],
        [ObjectLiteral, "{}"],
        [ObjectLiteral, "{a:1}"],
        [ObjectLiteral, "{a:{a:1}}"],
        [RangeArrayLiteral, "[..2]"],
        [RangeArrayLiteral, "[0..2]"],
        [RangeArrayLiteral, "[..2:2]"],
        [RangeArrayLiteral, "[0..2:2]"],
        [RegularExpressionLiteral, "/1/"],
        [RegularExpressionLiteral, "/\n/"],
    ])("single program", (literalType, program) => {
        it(`should be ${literalType.name}`, () => {
            const parser = new Parser(program);
            const ast = parser.parse();

            expect(ast).toBeInstanceOf(ProgramStatement);
            expect(ast.body[0]).toBeInstanceOf(ExpressionStatement);
            expect((ast.body[0] as ExpressionStatement).expression).toBeInstanceOf(literalType);
        });
    });
});

describe("Parse statements", () => {
    describe.each([
        [DeclarationStatement, "@a = 1"],
        [EndStatement, ";"],
    ])("single program", (statementType, program) => {
        it(`should be ${statementType.name}`, () => {
            const parser = new Parser(program);
            const ast = parser.parse();

            expect(ast).toBeInstanceOf(ProgramStatement);
            expect(ast.body[0]).toBeInstanceOf(statementType);
        });
    });
});
