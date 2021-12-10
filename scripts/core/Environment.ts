import { CallableFunction } from "./CallableFunction";
import { RuntimeError } from "./RuntimeError";

type StoredElement = {
    element: any;
    const: boolean;
};

export class Environment {
    values: Map<any, StoredElement>;
    enclosing: Environment | null;

    constructor(enclosing: Environment | null = null, defaultValues: Map<any, any> | null = null) {
        this.values = defaultValues ?? new Map();
        this.enclosing = enclosing;
    }

    add(name: string, value: any) {
        return this._add(name, { element: value, const: true });
    }

    mutadd(name: string, value: any) {
        return this._add(name, { element: value, const: false });
    }

    _add(name: string, value: StoredElement) {
        if (this.values.has(name)) {
            const v = this.values.get(name)!;

            if (CallableFunction.is(v) && v.std) {
                throw new RuntimeError(`keyword "${v.name}" is reserved`, this);
            }

            throw new RuntimeError(`Already declared variable "${name}"`, name);
        }

        this.values.set(name, value);
    }

    remove(name: string) {
        this.values.delete(name);
    }

    get(name: string): any {
        if (this.values.has(name)) {
            return this.values.get(name)!.element;
        }

        if (this.enclosing) {
            return this.enclosing.get(name)!;
        }

        throw new RuntimeError(`Undeclared variable "${name}"`, name);
    }

    assign(name: string, value: any) {
        if (this.values.has(name)) {
            const v = this.values.get(name)!;

            if (CallableFunction.is(v) && v.std) {
                throw new RuntimeError(`keyword "${v.name}" is reserved`, this);
            }

            if (v.const) {
                throw new RuntimeError(`"${name}" is const, cannot be reassigned`, this);
            }

            this.values.set(name, value);
            return;
        }

        if (this.enclosing !== null) {
            this.enclosing?.assign(name, value);
            return;
        }

        throw new RuntimeError(`Undeclared variable "${name}"`, name);
    }
}
