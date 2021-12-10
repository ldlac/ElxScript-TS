import { Statement } from "../Statement";

export abstract class Literal<T> extends Statement {
    protected value: T;

    constructor(value: T) {
        super();
        this.value = value;
    }
}
