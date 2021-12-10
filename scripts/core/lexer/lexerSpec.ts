import { TokenTypes } from "./tokenTypes";

export const SPEC: [RegExp, TokenTypes | null][] = [
    [/^\s+/, null],
    [/^\/\/.*/, null],
    [/^\/\*[\s\S]*?\*\//, null],

    // Symbols, Delimiters
    [/^\.\.\./, TokenTypes.SPREAD_OPERATOR],
    [/^\.\./, TokenTypes.RANGE],
    [/^\./, TokenTypes.DOT],

    [/^;/, TokenTypes.SEMI],
    [/^\}/, TokenTypes.CURLY_END],
    [/^\{/, TokenTypes.CURLY_START],
    [/^\(/, TokenTypes.PAREN_START],
    [/^\)/, TokenTypes.PAREN_END],
    [/^\,/, TokenTypes.COMMA],
    [/^\:/, TokenTypes.COL],
    [/^\]/, TokenTypes.BRACKET_END],
    [/^\[/, TokenTypes.BRACKET_START],
    [/^\/([^\/]*)\//, TokenTypes.REGULAR_EXPRESSION],

    // keywords
    [/^\@/, TokenTypes.let],
    [/^\btrue\b/, TokenTypes.true],
    [/^\bfalse\b/, TokenTypes.false],
    [/^\bnull\b/, TokenTypes.null],

    // Numbers
    [/^\-?\d+/, TokenTypes.NUMBER],

    // Identifiers
    [/^\w+/, TokenTypes.IDENTIFIER],

    [/^\|>/, TokenTypes.PIPE_OPERATOR],
    [/^=[><]/, TokenTypes.ARROW_FUNCTION],
    [/^\#/, TokenTypes.LENGTH_OPERATOR],

    // Equality operators
    [/^[=!]=/, TokenTypes.EQUALITY_OPERATOR],

    // Assignment Operators
    [/^=/, TokenTypes.SIMPLE_ASSIGNMENT],
    [/^[\*\/\+\-]=/, TokenTypes.COMPLEX_ASSIGNMENT],

    [/^\+\+/, TokenTypes.INCREMENT_OPERATOR],
    [/^\-\-/, TokenTypes.DECREMENT_OPERATOR],

    // Math operators
    [/^[\+\-]/, TokenTypes.ADDITITIVE_OPERATOR],
    [/^[*\/]/, TokenTypes.MULTIPLICATIVE_OPERATOR],
    [/^[\%]/, TokenTypes.MODULO_OPERATOR],

    // relational operators
    [/^[><]=?/, TokenTypes.RELATIONAL_OPERATOR],

    // logical operators
    [/^&&/, TokenTypes.LOGICAL_AND],
    [/^\|\|/, TokenTypes.LOGICAL_OR],
    [/^!/, TokenTypes.LOGICAL_NOT],

    // Strings
    [/^"[^"]*"/, TokenTypes.STRING],
    [/^'[^']*'/, TokenTypes.STRING],
];
