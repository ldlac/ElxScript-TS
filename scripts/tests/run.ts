import { run } from "../run";

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "time").mockImplementation(() => {});
jest.spyOn(console, "timeEnd").mockImplementation(() => {});

describe("when last instruction is truthy", () => {
    it("should return exit code 0", () => {
        const program = `
            true
        `;

        const a = run("test", program);

        expect(a).toEqual(0);
    });

    it("should return exit code 0", () => {
        const program = `
            1+1
        `;

        const a = run("test", program);

        expect(a).toEqual(0);
    });
});

describe("when last instruction is falsy", () => {
    it("should return exit code 1", () => {
        const program = `
            false
        `;

        const a = run("test", program);

        expect(a).toEqual(1);
    });
});
