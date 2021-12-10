class RuntimeError extends Error {
    token: any;
    constructor(msg: string, token: any) {
        super(msg);
        this.token = token;
    }
}

export { RuntimeError };
