import { Lexer } from "./lexer";
import { TokenTypes } from "./tokenTypes";

interface Token {
    type: TokenTypes;
    value: string;
}

export { TokenTypes, Token, Lexer };
