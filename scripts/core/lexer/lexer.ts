import { Token } from ".";
import { SPEC } from "./lexerSpec";

export class Lexer {
    private _content: string;
    private _cursor: number;

    constructor(content: string) {
        this._content = content;
        this._cursor = 0;
    }

    public getNextToken(): Token | null {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._content.slice(this._cursor);

        for (const [regexp, tokenType] of SPEC) {
            const tokenValue = this.match(regexp, string);

            if (tokenValue == null) {
                continue;
            }

            if (tokenType == null) {
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue,
            };
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}"`);
    }

    private hasMoreTokens() {
        return this._cursor < this._content.length;
    }

    private match(regexp: RegExp, string: string) {
        let matched = regexp.exec(string);
        if (matched == null) {
            return matched;
        }

        this._cursor += matched[0].length;

        return matched[matched.length - 1];
    }
}
