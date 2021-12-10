import { Literal, NumericLiteral, Parser, Statement } from "..";
import { CallableFunction } from "../../CallableFunction";
import { Callables, Elx } from "../../Elx";
import { ElxError } from "../../ElxError";
import { Interpreter } from "../../interpreter";
import { TokenTypes } from "../../lexer";
import { RuntimeError } from "../../RuntimeError";

const arrayCallables: Callables = {
    map: CallableFunction.new({
        name: "map",
        arity: 2,
        async call(args: [Elx<Array<any>>, CallableFunction]) {
            const [elx, cb] = args;

            if (!CallableFunction.is(cb)) {
                throw new RuntimeError("$1 parameter must be a function", this);
            }

            elx.mset(elx.get().map((i) => cb.call([i])));

            return elx;
        },
        toString() {
            return `<map() native fn ...>`;
        },
    }),
    for: CallableFunction.new({
        name: "for",
        arity: 2,
        call(args: [Elx<Array<any>>, CallableFunction]) {
            const [elx, cb] = args;

            if (!CallableFunction.is(cb)) {
                throw new RuntimeError("$1 parameter must be a function", this);
            }

            elx.get().forEach((i) => cb.call([i]));
        },
        toString() {
            return `<for() native fn ...>`;
        },
    }),
    slice: CallableFunction.new({
        name: "slice",
        arity: 2,
        call(args: [Elx<Array<any>>, Elx<number>]) {
            const [elx, i] = args;

            if (Elx.is(i)) {
                const sliceArg = i.get();

                if (sliceArg.constructor.name !== Number.name) {
                    throw new RuntimeError("$1 parameter must be a number", this);
                }

                return elx.get().slice(sliceArg);
            }

            throw new ElxError("slice()");
        },
        toString() {
            return `<slice() native fn ...>`;
        },
    }),
};

export class ArrayLiteral extends Literal<Statement[]> {
    constructor(elements: Statement[]) {
        super(elements);
    }

    static new(parser: Parser) {
        parser.__eat(TokenTypes.BRACKET_START);

        try {
            if (parser.__isNextToken(TokenTypes.BRACKET_END)) {
                return new ArrayLiteral([]);
            }

            const _buildCommaListElements = (firstArrayStatement: Statement) => {
                if (parser.__isNextToken(TokenTypes.COMMA)) parser.__eat(TokenTypes.COMMA);

                return new ArrayLiteral([
                    firstArrayStatement,
                    ...(parser._lookahead?.type === TokenTypes.BRACKET_END ? [] : parser._ParseArgumentList()),
                ]);
            };

            if (parser.__isNextToken(TokenTypes.RANGE)) {
                return RangeArrayLiteral.new(parser);
            } else {
                const firstArrayStatement = parser.Expression();

                return parser.__isNextToken(TokenTypes.RANGE)
                    ? RangeArrayLiteral.new(parser, firstArrayStatement)
                    : _buildCommaListElements(firstArrayStatement);
            }
        } finally {
            parser.__eat(TokenTypes.BRACKET_END);
        }
    }

    public visit(interpreter: Interpreter) {
        const values = this.value.map((element) => interpreter.visit(element));

        return new Elx<Array<any>>(values, "Array", arrayCallables);
    }
}

export class RangeArrayLiteral extends Literal<Statement[]> {
    start: Statement;
    end: Statement;
    step: Statement;

    constructor(start: Statement, end: Statement, step: Statement) {
        super([]);

        this.start = start;
        this.end = end;
        this.step = step;
    }

    static new(parser: Parser, firstArrayStatement?: Statement) {
        const start = firstArrayStatement ?? new NumericLiteral(0);

        parser.__eat(TokenTypes.RANGE);

        const end = parser.Expression();

        const step =
            parser.__isNextToken(TokenTypes.COL) && parser.__eat(TokenTypes.COL)
                ? parser.Expression()
                : new NumericLiteral(1);

        return new RangeArrayLiteral(start, end, step);
    }

    public visit(interpreter: Interpreter) {
        const start = Elx.unwrap(interpreter.visit(this.start));
        const end = Elx.unwrap(interpreter.visit(this.end));
        const step = Elx.unwrap(interpreter.visit(this.step));

        if (end <= start) {
            throw new RuntimeError("End must be greater than start", this);
        }

        if (end < 0 || start < 0 || step < 0) {
            throw new RuntimeError("Must be greater than zero", this);
        }

        const values = Array(Math.ceil((end + 1 - start) / step))
            .fill(start)
            .map((x, y) => x + y * step);

        return new Elx<Array<any>>(values, "Array", arrayCallables);
    }
}
