import { run } from "../run";

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "time").mockImplementation(() => {});
jest.spyOn(console, "timeEnd").mockImplementation(() => {});

describe("when last instruction is truthy", () => {
    it("should return exit code 0", () => {
        const program = `
            @a = (b) => b + 1 - 1 * 1 / 1
            a(1 |> a)
        `;

        const a = run("test", program);

        expect(a).toEqual(0);
    });

    it("should return exit code 0", () => {
        const program = `
            @a = true && 1 && "a" && []
            a
        `;

        const a = run("test", program);

        expect(a).toEqual(0);
    });
});

describe("when last instruction is falsy", () => {
    it("should return exit code 1", () => {
        const program = `
            @a = false && 0 && ""
            a
        `;

        const a = run("test", program);

        expect(a).toEqual(1);
    });
});
