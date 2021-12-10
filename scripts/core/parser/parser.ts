import {
    ExpressionStatement,
    ProgramStatement,
    BinaryExpression,
    Statement,
    EndStatement,
    BlockStatement,
    CallExpression,
    NumericLiteral,
    StringLiteral,
    IdentifierStatement,
    Literal,
    BooleanLiteral,
    DeclarationStatement,
    EmptyStatement,
    ArgumentStatement,
    ArrayLiteral,
    ObjectLiteral,
    DotExpression,
    RegularExpressionLiteral,
    LeftUnaryExpression,
    RightUnaryExpression,
    PipeOperatorExpression,
} from ".";
import { Lexer, Token, TokenTypes } from "../lexer";

export class Parser {
    private _lexer: Lexer;
    public _lookahead: Token | null;

    constructor(content: string) {
        this._lexer = new Lexer(content);
        this._lookahead = null;
    }

    parse() {
        this._lookahead = this._lexer.getNextToken();

        try {
            return ProgramStatement.new(this);
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw error;
            } else {
                throw new SyntaxError("Unexpected syntax error");
            }
        }
    }

    StatementList(stopLookAhead: string | null = null) {
        if (this._lookahead === null) {
            return [];
        }

        const statementList = [this.Statement()];

        while (this._lookahead && this._lookahead.type !== stopLookAhead) {
            statementList.push(this.Statement());
        }

        return statementList;
    }

    Statement(): Statement {
        return this.__dig([
            [TokenTypes.let, () => DeclarationStatement.new(this)],
            // [TokenTypes.CURLY_START, () => BlockStatement.new(this)],
            [TokenTypes.SEMI, () => EndStatement.new(this)],
            [true, () => ExpressionStatement.new(this)],
        ]);
    }

    Expression(): BinaryExpression | Statement {
        return this.AssignmentExpression();
    }

    PipeOperatorExpression(nextExpression: () => BinaryExpression | Statement): Statement {
        let left = nextExpression();

        if (this.__isNextToken(TokenTypes.PIPE_OPERATOR)) {
            this.__eat(TokenTypes.PIPE_OPERATOR);

            const argumentList = [];

            do {
                argumentList.push(this.CallMemberExpression());
            } while (this._lookahead?.type === TokenTypes.PIPE_OPERATOR && this.__eat(TokenTypes.PIPE_OPERATOR));

            return new PipeOperatorExpression(left, argumentList);
        }

        return left;
    }

    AssignmentExpression(skip: number = 0): BinaryExpression | Statement {
        const expressions = [
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.SIMPLE_ASSIGNMENT, () => this.Expression()),
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.COMPLEX_ASSIGNMENT, () => this.Expression()),
            (_: () => BinaryExpression | Statement) => this.LogicalBinaryExpression(),
        ];

        return this.__digBinaryExpression(skip + 1, expressions.slice(skip)[0], this.AssignmentExpression.bind(this));
    }

    LogicalBinaryExpression(skip: number = 0): BinaryExpression | Statement {
        const expressions = [
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.LOGICAL_AND, () =>
                    this.LogicalBinaryExpression()
                ),
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.LOGICAL_OR, () => this.LogicalBinaryExpression()),
            (_: () => BinaryExpression | Statement) => this.RelationalBinaryExpression(),
        ];

        return this.__digBinaryExpression(
            skip + 1,
            expressions.slice(skip)[0],
            this.LogicalBinaryExpression.bind(this)
        );
    }

    RelationalBinaryExpression(skip: number = 0): BinaryExpression | Statement {
        const expressions = [
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.RELATIONAL_OPERATOR, () =>
                    this.RelationalBinaryExpression()
                ),
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.EQUALITY_OPERATOR, () =>
                    this.RelationalBinaryExpression()
                ),
            (_: () => BinaryExpression | Statement) => this.BinaryExpression(),
        ];

        return this.__digBinaryExpression(
            skip + 1,
            expressions.slice(skip)[0],
            this.RelationalBinaryExpression.bind(this)
        );
    }

    BinaryExpression(skip: number = 0): BinaryExpression | Statement {
        const expressions = [
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.MODULO_OPERATOR, () => this.BinaryExpression()),
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.MULTIPLICATIVE_OPERATOR, () =>
                    this.BinaryExpression()
                ),
            (nextExpression: () => BinaryExpression | Statement) =>
                BinaryExpression.new(this, nextExpression, TokenTypes.ADDITITIVE_OPERATOR, () =>
                    this.BinaryExpression()
                ),
            (nextExpression: () => BinaryExpression | Statement) => this.PipeOperatorExpression(nextExpression),
            (nextExpression: () => BinaryExpression | Statement) => DotExpression.new(this, nextExpression),
            (nextExpression: () => BinaryExpression | Statement) => this.ArrowFunctionExpression(nextExpression),
            (_: () => BinaryExpression | Statement) => this.LeftUnaryExpression(),
        ];

        return this.__digBinaryExpression(skip + 1, expressions.slice(skip)[0], this.BinaryExpression.bind(this));
    }

    ArrowFunctionExpression(nextExpression: () => BinaryExpression | Statement): BinaryExpression | Statement {
        let left = nextExpression();

        if (this.__isNextToken(TokenTypes.ARROW_FUNCTION)) {
            const operator = this.__eat(TokenTypes.ARROW_FUNCTION).value;

            const right = BlockStatement.new(this);

            return new BinaryExpression(operator, left, right);
        }

        return left;
    }

    LeftUnaryExpression(skip: number = 0): BinaryExpression | Statement {
        const expressions = [
            (nextExpression: () => LeftUnaryExpression | Statement) =>
                LeftUnaryExpression.new(this, nextExpression, TokenTypes.INCREMENT_OPERATOR),
            (nextExpression: () => LeftUnaryExpression | Statement) =>
                LeftUnaryExpression.new(this, nextExpression, TokenTypes.DECREMENT_OPERATOR),
            (_: () => LeftUnaryExpression | Statement) => this.RightUnaryExpression(),
        ];

        return this.__digBinaryExpression(skip + 1, expressions.slice(skip)[0], this.LeftUnaryExpression.bind(this));
    }

    RightUnaryExpression() {
        return this.__dig([
            [TokenTypes.INCREMENT_OPERATOR, () => RightUnaryExpression.new(this, TokenTypes.INCREMENT_OPERATOR)],
            [TokenTypes.DECREMENT_OPERATOR, () => RightUnaryExpression.new(this, TokenTypes.DECREMENT_OPERATOR)],
            [TokenTypes.LENGTH_OPERATOR, () => RightUnaryExpression.new(this, TokenTypes.LENGTH_OPERATOR)],

            [true, () => this.CallMemberExpression()],
        ]);
    }

    CallMemberExpression() {
        const member = this.MemberExpression();

        if (this.__isNextToken(TokenTypes.PAREN_START)) {
            return this.handleCallExpression(member);
        }

        return member;
    }

    MemberExpression() {
        return this.PrimaryExpression();
    }

    handleCallExpression(callee: Statement) {
        return new CallExpression(callee, this._ParseArguments());
    }

    _ParseArguments() {
        this.__eat(TokenTypes.PAREN_START);

        const argumentList = this._lookahead?.type === TokenTypes.PAREN_END ? [] : this._ParseArgumentList();

        this.__eat(TokenTypes.PAREN_END);

        return argumentList;
    }

    _ParseArgumentList() {
        const argumentList = [];

        do {
            argumentList.push(this.Expression());
        } while (this._lookahead?.type === TokenTypes.COMMA && this.__eat(TokenTypes.COMMA));

        return argumentList;
    }

    PrimaryExpression(): Statement {
        return this.__dig([
            [TokenTypes.PAREN_START, () => this.ExpressionParentesis()],
            [TokenTypes.IDENTIFIER, () => IdentifierStatement.new(this)],
            [true, () => this.Literal()],
        ]);
    }

    ExpressionParentesis() {
        const statements = this._ParseArguments();

        if (statements.length === 0) {
            return new EmptyStatement();
        } else if (statements.length === 1) {
            return statements[0];
        } else {
            return new ArgumentStatement(statements);
        }
    }

    Literal(): Literal<any> {
        return this.__dig([
            [TokenTypes.CURLY_START, () => ObjectLiteral.new(this)],
            [TokenTypes.BRACKET_START, () => ArrayLiteral.new(this)],
            [TokenTypes.REGULAR_EXPRESSION, () => RegularExpressionLiteral.new(this)],
            [TokenTypes.NUMBER, () => NumericLiteral.new(this)],
            [TokenTypes.STRING, () => StringLiteral.new(this)],
            [TokenTypes.true, () => BooleanLiteral.new(this, TokenTypes.true)],
            [TokenTypes.false, () => BooleanLiteral.new(this, TokenTypes.false)],
        ]);
    }

    __isNextToken(token: TokenTypes) {
        return this._lookahead && this._lookahead.type === token;
    }

    __digBinaryExpression(
        skip: number,
        nextInstruction: (nextExpression: () => BinaryExpression | Statement) => BinaryExpression | Statement,
        binaryExpression: (skip?: number) => BinaryExpression | Statement
    ): BinaryExpression | Statement {
        if (nextInstruction) {
            return nextInstruction(() => binaryExpression(skip));
        }

        throw new SyntaxError(`Unexpected token "${this._lookahead?.type}"`);
    }

    __dig(instructions: [tokenType: TokenTypes | boolean, hit: () => any][]) {
        let h = null;

        for (const [token, hit] of instructions) {
            h = this.__hitOrDig(token, hit);
            if (h) {
                return h;
            }
        }

        throw new SyntaxError(`Unexpected ${this._lookahead?.type}`);
    }

    __hitOrDig(tokenType: TokenTypes | boolean, hit: () => any): any | undefined {
        if (tokenType === true || (typeof tokenType !== "boolean" && this.__isNextToken(tokenType))) {
            return hit();
        } else {
            return undefined;
        }
    }

    __eat(tokenType: TokenTypes) {
        let token = this._lookahead;

        if (token === null) {
            if (tokenType === TokenTypes.SEMI) {
                token = {
                    type: TokenTypes.SEMI,
                    value: ";",
                };
            } else {
                throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
            }
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}, expected ${tokenType}"`);
        }

        this._lookahead = this._lexer.getNextToken();

        return token;
    }
}
