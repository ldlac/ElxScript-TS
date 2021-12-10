import { IdentifierStatement, Parser, Statement } from "..";
import { CallableFunction } from "../../CallableFunction";
import { Elx } from "../../Elx";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { RuntimeError } from "../../RuntimeError";
import { Literal } from "./Literal";

export class ObjectLiteral extends Literal<Record<string, Statement>> {
    objects: IdentifierStatement[];

    constructor(value: Record<string, Statement>, ...objects: IdentifierStatement[]) {
        super(value);

        this.objects = objects;
    }

    static new(parser: Parser) {
        parser.__eat(TokenTypes.CURLY_START);

        const identifiers: IdentifierStatement[] = [];

        const objectElementSpread = (): [string, Statement][] => {
            parser.__eat(TokenTypes.SPREAD_OPERATOR);

            const right = parser.Expression();

            if (ObjectLiteral.is(right)) {
                return Object.keys(right.value).reduce((a: [string, Statement][], b) => {
                    return [...a, [b, right.value[b]]];
                }, []);
            }

            if (IdentifierStatement.is(right)) {
                identifiers.push(right);
                return [];
            }

            throw new SyntaxError("Unexpected object initializer");
        };

        const objectElementDeclaration = (): [string, Statement] => {
            const left = IdentifierStatement.new(parser);

            parser.__eat(TokenTypes.COL);

            const right = parser.Expression();

            return [left.name, right];
        };

        const objectElementsDeclarations = () => {
            const argumentList = [];

            do {
                if (parser.__isNextToken(TokenTypes.SPREAD_OPERATOR)) {
                    argumentList.push(...objectElementSpread());
                } else {
                    argumentList.push(objectElementDeclaration());
                }
            } while (parser.__isNextToken(TokenTypes.COMMA) && parser.__eat(TokenTypes.COMMA));

            return argumentList.reduce((a: Record<string, Statement>, x: [string, Statement]) => {
                const [key, value] = x;
                return { ...a, [key]: value };
            }, {});
        };

        const obj = parser.__isNextToken(TokenTypes.CURLY_END) ? {} : objectElementsDeclarations();

        parser.__eat(TokenTypes.CURLY_END);

        return new ObjectLiteral(obj, ...identifiers);
    }

    public visit(interpreter: Interpreter) {
        let callables: Record<string, CallableFunction> = {};

        let obj = Object.keys(this.value).reduce((a: Record<string, any>, x) => {
            const value = interpreter.visit(this.value[x]);

            if (CallableFunction.is(value)) {
                callables[x] = value;
            }

            return { ...a, [x]: value };
        }, {});

        obj = this.objects.reduce((a, object) => {
            const value = interpreter.visit(object);

            if (Elx.is(value)) {
                callables = { ...callables, ...value.callables };

                return { ...a, ...value._value };
            }

            throw new RuntimeError("Invalid", this);
        }, obj);

        return new Elx<Record<string, any>>(obj, "Object", {}, callables);
    }

    public static is(other: any): other is ObjectLiteral {
        return other?.constructor.name === ObjectLiteral.name;
    }
}
